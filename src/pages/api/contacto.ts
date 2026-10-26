/* Endpoint del formulario de contacto (función serverless en Vercel).
   Variables de entorno necesarias (Vercel → Settings → Environment Variables):
     RESEND_API_KEY   clave de https://resend.com
     CONTACT_TO       destino, por defecto brandon@zektra.co
     CONTACT_FROM     remitente verificado en Resend, p. ej. "Zektra Web <web@zektra.co>"
   Opcionales (anti-spam):
     TURNSTILE_SECRET_KEY         clave secreta de Cloudflare Turnstile; si falta, no se verifica el captcha.
     PUBLIC_TURNSTILE_SITE_KEY    clave pública (la lee contacto.astro para pintar el widget).
   Protecciones activas: honeypot, trampa de tiempo (mínimo 3 s en el formulario), límite de
   3 envíos por IP cada 10 minutos (memoria de la función; suficiente contra ráfagas) y Turnstile. */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const env = (k: string) => (import.meta.env[k] as string | undefined) ?? process.env[k];

/* Límite por IP en memoria. Cada instancia serverless tiene su propia tabla, así que el límite es
   aproximado; frena ráfagas desde una misma IP sin necesidad de una base de datos. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return false;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) return true; // sin clave configurada no bloqueamos el formulario
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const out = (await res.json()) as { success?: boolean };
    return !!out.success;
  } catch (err) {
    console.error('[contacto] Turnstile no respondió', err);
    return true; // si Cloudflare falla, no castigamos a la persona
  }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'desconocida';
  if (rateLimited(ip)) {
    return json({ error: 'Recibimos varios mensajes seguidos desde tu conexión. Intenta de nuevo en unos minutos.' }, 429);
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ error: 'No pudimos leer el formulario.' }, 400);
  }

  // Honeypot: si un bot llenó el campo oculto, respondemos OK sin enviar nada.
  if (String(data.get('sitio') ?? '').trim()) return json({ ok: true });

  // Trampa de tiempo: el formulario pone la hora en que se abrió; un envío en menos de 3 s es un bot.
  const opened = Number(data.get('t0') ?? 0);
  if (opened && Date.now() - opened < 3000) return json({ ok: true });

  if (!(await verifyTurnstile(String(data.get('cf-turnstile-response') ?? ''), ip))) {
    return json({ error: 'No pudimos confirmar que eres una persona. Recarga la página e intenta de nuevo.' }, 403);
  }

  const nombre = String(data.get('nombre') ?? '').trim().slice(0, 120);
  const correo = String(data.get('correo') ?? '').trim().slice(0, 200);
  const empresa = String(data.get('empresa') ?? '').trim().slice(0, 160);
  const servicio = String(data.get('servicio') ?? '').trim().slice(0, 120);
  const mensaje = String(data.get('mensaje') ?? '').trim().slice(0, 5000);
  const autorizacion = data.get('autorizacion') === 'si';

  if (nombre.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo) || mensaje.length < 10 || !autorizacion) {
    return json({ error: 'Revisa los campos del formulario.' }, 422);
  }

  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) {
    console.error('[contacto] Falta RESEND_API_KEY');
    return json({ error: 'El formulario aún no está configurado.' }, 503);
  }

  const to = env('CONTACT_TO') ?? 'brandon@zektra.co';
  const from = env('CONTACT_FROM') ?? 'Zektra Web <onboarding@resend.dev>';

  const rows = [
    ['Nombre', nombre],
    ['Correo', correo],
    ['Empresa', empresa || '—'],
    ['Servicio', servicio || '—'],
    // Prueba de la autorización de tratamiento de datos (Ley 1581 de 2012, art. 9): queda en el correo recibido.
    ['Autorización de datos', `Sí, aceptada en el formulario el ${new Date().toISOString()} (UTC)`],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#020315">
      <h2 style="margin:0 0 16px">Nuevo mensaje desde zektra.co</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows.map(([k, v]) => `<tr><td style="color:#5E6185">${k}</td><td><strong>${escape(v)}</strong></td></tr>`).join('')}
      </table>
      <p style="margin:20px 0 6px;color:#5E6185">Mensaje</p>
      <p style="white-space:pre-wrap;margin:0">${escape(mensaje)}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: correo,
      subject: `Nuevo proyecto: ${nombre}${empresa ? ` · ${empresa}` : ''}`,
      html,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${mensaje}`,
    });
    if (error) throw new Error(error.message);
    return json({ ok: true });
  } catch (err) {
    console.error('[contacto]', err);
    return json({ error: 'No pudimos enviar el mensaje.' }, 502);
  }
};
