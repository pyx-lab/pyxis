export async function getRecaptchaToken(): Promise<string | null> {
  if (typeof window === "undefined" || !window.grecaptcha) return null;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;

  return new Promise((resolve) => {
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(siteKey, {
          action: "search",
        });
        resolve(token);
      } catch (e) {
        console.warn("reCAPTCHA execution failed:", e);
        resolve(null);
      }
    });
  });
}