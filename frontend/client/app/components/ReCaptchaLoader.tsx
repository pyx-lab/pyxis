"use client";

import { useEffect, useState } from "react";

interface ReCaptchaLoaderProps {
  siteKey: string;
}

export default function ReCaptchaLoader({ siteKey }: ReCaptchaLoaderProps) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const handleInteraction = () => setShowBadge(true);
    document.addEventListener("focusin", handleInteraction);
    return () => document.removeEventListener("focusin", handleInteraction);
  }, []);

  useEffect(() => {
    const scriptId = "recaptcha-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.id = scriptId;
    script.async = true;
    script.onload = () => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.render("recaptcha-badge", {
          sitekey: siteKey,
          badge: "inline",
        });
      });
    };
    document.body.appendChild(script);
  }, [siteKey]);

  return <div id="recaptcha-badge" className={showBadge ? "" : "hidden"} />;
}
