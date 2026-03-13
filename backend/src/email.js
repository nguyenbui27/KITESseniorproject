const EMAIL_PROVIDER = String(process.env.EMAIL_PROVIDER || 'resend').trim().toLowerCase();
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim();
const EMAIL_FROM = String(process.env.EMAIL_FROM || '').trim();

function emailEnabled() {
  return EMAIL_PROVIDER === 'resend' && !!RESEND_API_KEY && !!EMAIL_FROM;
}

async function sendResendEmail({ to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error ${response.status}: ${text}`);
  }
}

async function sendEmail({ to, subject, html }) {
  if (!emailEnabled()) {
    throw new Error(
      'Email provider is not configured. Set EMAIL_PROVIDER=resend, RESEND_API_KEY, and EMAIL_FROM.',
    );
  }

  if (EMAIL_PROVIDER === 'resend') {
    await sendResendEmail({ to, subject, html });
    return;
  }

  throw new Error(`Unsupported email provider: ${EMAIL_PROVIDER}`);
}

module.exports = {
  sendEmail,
  emailEnabled,
};
