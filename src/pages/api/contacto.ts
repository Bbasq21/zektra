/* Endpoint del formulario de contacto (función serverless en Vercel).
   Variables de entorno necesarias (Vercel → Settings → Environment Variables):
     RESEND_API_KEY   clave de https://resend.com
     CONTACT_TO       destino, por defecto brandon@zektra.co
     CONTACT_FROM     remitente verificado en Resend, p. ej. "Zektra Web <web@zektra.co>" */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ error: 'No pudimos leer el formulario.' }, 400);
  }

  // Honeypot: si un bot llenó el campo oculto, respondemos OK sin enviar nada.
  if (String(data.get('sitio') ?? '').trim()) return json({ ok: true });

  const nombre = String(data.get('nombre') ?? '').trim().slice(0, 120);
  const correo = String(data.get('correo') ?? '').trim().slice(0, 200);
  const empresa = String(data.get('empresa') ?? '').trim().slice(0, 160);
  const servicio = String(data.get('servicio') ?? '').trim().slice(0, 120);
  const mensaje = String(data.get('mensaje') ?? '').trim().slice(0, 5000);
  const autorizacion = data.get('autorizacion') === 'si';

  if (nombre.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo) || mensaje.length < 10 || !autorizacion) {
    return json({ error: 'Revisa los campos del formulario.' }, 422);
  }

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contacto] Falta RESEND_API_KEY');
    return json({ error: 'El formulario aún no está configurado.' }, 503);
  }

  const to = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? 'brandon@zektra.co';
  const from = import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? 'Zektra Web <onboarding@resend.dev>';

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
