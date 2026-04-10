import { Resend } from 'resend';
import { Analytics } from "@vercel/analytics/next"

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  try {
    await resend.emails.send({
      from: 'CloudHead Site <support@cloudheadco.com>', // troque pelo seu domínio verificado depois
      to: 'support@cloudheadco.com',                 // seu e-mail de destino
      replyTo: email,
      subject: `Nova mensagem pelo site — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="margin-bottom:4px">Nova mensagem pelo site</h2>
          <hr style="border:1px solid #eee;margin:16px 0">
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Mensagem:</strong></p>
          <p style="background:#f5f5f5;padding:12px 16px;border-radius:8px;white-space:pre-wrap">${message}</p>
          <hr style="border:1px solid #eee;margin:16px 0">
          <p style="font-size:12px;color:#999">Enviado via cloudhead.com.br</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail. Tente novamente.' });
  }
}