import { requiredEnv } from "./req-env";

export async function sendSignInCode(email: string, otp: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requiredEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: requiredEnv("AUTH_EMAIL_FROM"),
      to: [email],
      subject: "Your Relay sign-in code",
      text: `Your Relay sign-in code is ${otp}. It expires in 10 minutes.`,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OTP email delivery failed with status ${response.status}.`,
    );
  }
}