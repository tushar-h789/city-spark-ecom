// lib/email.ts

export async function sendResetPasswordEmail(email: string, token: string) {
  // In a real implementation, this would send an email
  // For now, we'll just log the reset link
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  console.log("---- Password Reset Email ----");
  console.log(`To: ${email}`);
  console.log(`Reset your password by clicking this link: ${resetLink}`);
  console.log("------------------------------");

  // In a real implementation, you would return a promise that resolves when the email is sent
  return Promise.resolve();
}
