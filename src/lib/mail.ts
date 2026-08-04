import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Подтвердите email — ListoLV",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ListoLV</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Доска объявлений</p>
        </div>
        <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Привет, ${name}! 👋</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Спасибо за регистрацию на ListoLV. Для завершения регистрации подтвердите ваш email адрес.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${url}"
               style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none;
                      padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Подтвердить Email
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">
            Ссылка действует 24 часа. Если вы не регистрировались на ListoLV — просто проигнорируйте это письмо.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Сброс пароля — ListoLV",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ListoLV</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Сброс пароля</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Мы получили запрос на сброс пароля для аккаунта ${email}.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${url}"
               style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none;
                      padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Сбросить пароль
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">
            Ссылка действует 1 час. Если вы не запрашивали сброс пароля — проигнорируйте это письмо.
          </p>
        </div>
      </div>
    `,
  });
}
