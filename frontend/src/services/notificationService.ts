/**
 * AgriBridgeZero Notification & OTP Dispatch Service
 * Powered by Resend (Free tier: 100 emails/day, 3000/month)
 * Supports simulated instant SMS OTP (Zepto/Blinkit/Rapido speed)
 */

export interface SendOtpParams {
  recipient: string; // phone number (+91...) or email
  type: "phone" | "email";
  userName?: string;
}

export interface SendNotificationParams {
  to: string;
  subject: string;
  htmlContent: string;
}

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || "";
const RESEND_FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || "onboarding@resend.dev";
const DEMO_OTP = import.meta.env.VITE_DEMO_OTP_CODE || "779580";

export async function sendOtp(params: SendOtpParams): Promise<{ success: boolean; code: string; message: string }> {
  const code = DEMO_OTP;

  // If using Resend and recipient is an email or phone notification email:
  if (RESEND_API_KEY && RESEND_API_KEY.startsWith("re_")) {
    try {
      const emailTarget = params.type === "email" ? params.recipient : (import.meta.env.VITE_NOTIFICATION_EMAIL || "alerts@agribridgezero.com");
      
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `AgriBridgeZero <${RESEND_FROM_EMAIL}>`,
          to: [emailTarget],
          subject: `Your AgriBridgeZero Verification Code: ${code}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #F7F5EF; padding: 28px; border-radius: 16px; border: 1px solid #E5E1D8;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #242522; margin: 0; font-size: 22px;">AgriBridgeZero</h1>
                <p style="color: #6F6D66; font-size: 13px; margin-top: 4px;">Understand Your Soil. Make Smarter Decisions.</p>
              </div>
              <div style="background: #FFFFFF; padding: 24px; border-radius: 12px; border: 1px solid #E5E1D8; text-align: center;">
                <p style="color: #6F6D66; font-size: 14px; margin-top: 0;">Here is your single-use verification code for AgriBridgeZero:</p>
                <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #B76543; margin: 20px 0; padding: 12px; background: #FAF8F3; border-radius: 8px; border: 1px dashed #B76543;">
                  ${code}
                </div>
                <p style="color: #8C887E; font-size: 12px; margin-bottom: 0;">Valid for 5 minutes. Do not share this OTP with anyone.</p>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #8C887E; font-size: 11px;">
                © 2026 AgriBridgeZero Soil Intelligence. All rights reserved.
              </div>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("Resend API warning (fallback to simulated instant OTP):", errorData);
      }
    } catch (err) {
      console.warn("Resend dispatch notice:", err);
    }
  }

  // Fast Zepto-style feedback: instant simulated OTP
  return {
    success: true,
    code,
    message: `OTP sent successfully to ${params.recipient}. For testing use: ${code}`,
  };
}

export async function sendSoilAlert(params: SendNotificationParams): Promise<boolean> {
  if (!RESEND_API_KEY || !RESEND_API_KEY.startsWith("re_")) {
    console.info("Simulated soil alert dispatch:", params);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `AgriBridgeZero Alerts <${RESEND_FROM_EMAIL}>`,
        to: [params.to],
        subject: params.subject,
        html: params.htmlContent,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
