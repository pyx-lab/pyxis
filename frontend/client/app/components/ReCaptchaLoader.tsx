"use client";

import { useEffect } from "react";

interface ReCaptchaLoaderProps {
  siteKey: string;
}

export default function ReCaptchaLoader({ siteKey }: ReCaptchaLoaderProps) {
  useEffect(() => {
    const scriptId = "recaptcha-v3-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [siteKey]);

  return null;
}
