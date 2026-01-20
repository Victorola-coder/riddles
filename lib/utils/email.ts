import nodemailer from 'nodemailer';

/**
 * Centralized email utility using Nodemailer.
 *
 * This is intentionally minimal and env-driven so you can swap providers later.
 */

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    // In dev, we silently fall back to console logging.
    // In prod, make sure all env vars are configured.
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // common heuristic
    auth: { user, pass },
  });
}

const FROM_ADDRESS =
  process.env.EMAIL_FROM || 'Riddle Quest <no-reply@riddle-quest.test>';

export async function sendPasswordResetEmail(options: {
  to: string;
  resetLink: string;
}): Promise<void> {
  const transport = getTransport();

  const subject = 'Reset your Riddle Quest password';
  const text = `You requested a password reset for Riddle Quest.

If this was you, click the link below to reset your password:
${options.resetLink}

If you did not request this, you can safely ignore this email.`;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #e5e7eb; background-color: #020617; padding: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #020617; border-radius: 16px; border: 1px solid #1f2933;">
        <tr>
          <td style="padding: 24px 24px 16px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; background: linear-gradient(90deg, #8b5cf6, #fbbf24); -webkit-background-clip: text; color: transparent;">
              🧩 Riddle Quest
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 16px; text-align: center; color: #9ca3af; font-size: 14px;">
            You requested a password reset. Click the button below to choose a new password.
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 24px 24px; text-align: center;">
            <a href="${options.resetLink}"
               style="display: inline-block; padding: 10px 20px; border-radius: 999px; background: linear-gradient(90deg, #8b5cf6, #fbbf24); color: #020617; font-weight: 600; font-size: 14px; text-decoration: none;">
              Reset Password
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 24px; font-size: 12px; color: #6b7280;">
            If the button above doesn't work, copy and paste this link into your browser:
            <br />
            <span style="word-break: break-all; color: #9ca3af;">${options.resetLink}</span>
          </td>
        </tr>
      </table>
      <p style="margin-top: 16px; font-size: 11px; color: #4b5563; text-align: center;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  if (!transport) {
    // Dev-friendly fallback: log to console so you can still test flows.
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV] Password reset email payload:', {
        to: options.to,
        subject,
        text,
      });
    return;
  }

  await transport.sendMail({
    from: FROM_ADDRESS,
    to: options.to,
    subject,
    text,
    html,
  });
}

