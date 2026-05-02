interface ReCaptchaInstance {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
  render(container: string | HTMLElement, parameters: {
    sitekey: string;
    badge?: string;
    size?: string;
  }): number;
}

interface Window {
  grecaptcha: ReCaptchaInstance;
}