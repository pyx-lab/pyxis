import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for Pyxis, an open-source, self-hosted search engine by PyxLab.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-6 py-4">
        <Link href="/">
          <Image
            src="/images/pyxis.svg"
            alt="Pyxis"
            width={90}
            height={30}
            className="w-[72px] h-auto"
            priority
          />
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-14 w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Terms of Use
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Plain language. No legalese.
        </p>

        <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              What Pyxis is
            </h2>
            <p>
              Pyxis is an open-source, self-hosted search engine built by{" "}
              <Link
                href="/about"
                className="underline underline-offset-2 hover:text-gray-900 transition-colors"
              >
                PyxLab
              </Link>{" "}
              as a demo and learning project. It is not a commercial product. It
              is provided as-is, free to use, and free to run on your own
              infrastructure.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Use it freely
            </h2>
            <p>
              You are welcome to use Pyxis for personal searches, to explore how
              it works, or to fork the project and run your own instance. The
              source code is open and the intent is always to be useful.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Do not abuse it
            </h2>
            <p>
              This is a small, community-maintained project running on limited
              resources. Please do not use automated scripts to hammer the
              search endpoint, attempt to exploit vulnerabilities, or do
              anything that would make it harder for others to use. To protect
              against bots and abuse, Pyxis uses Google reCAPTCHA v3. By using
              this site, you agree that your interactions may be subject to the
              Google reCAPTCHA terms and privacy policy.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              No warranty
            </h2>
            <p>
              Pyxis is provided without any warranty. Search results come from
              external sources and we have no control over their accuracy or
              availability. The service may go down, change, or stop at any
              time. We are a small open-source project, not a company with an
              SLA.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Results are from third parties
            </h2>
            <p>
              Pyxis aggregates results from external search and data sources. We
              do not produce, endorse, or verify the content of those results.
              If a result leads somewhere harmful, that is not something we have
              control over.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Self-hosting
            </h2>
            <p>
              If you run your own instance of Pyxis, you are responsible for how
              it is operated. The open-source license governs how you can use
              and distribute the code. See the repository for details.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Changes
            </h2>
            <p>
              These terms may change as the project evolves. We will not trick
              you. Any meaningful change will be visible in the project's commit
              history.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 px-6 py-5 flex items-center justify-center gap-6">
        <span className="text-xs text-gray-400">
          © {new Date().getFullYear()} PyxLab
        </span>
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/privacy"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          Privacy
        </Link>
        <Link
          href="/about"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          About
        </Link>
      </footer>
    </div>
  );
}
