import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pyxis is an open-source search engine by PyxLab. Your IP is masked at every proxy layer. Transparent analytics included.",
};

export default function AboutPage() {
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
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            About Pyxis
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            An open-source search engine. Minimal, honest, and verifiable.
          </p>
        </div>

        <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              What it is
            </h2>
            <p>
              Pyxis is a self-hostable metasearch engine that pulls results from
              various public sources (Bing, Brave, DuckDuckGo, Wikipedia, etc.)
              through the{" "}
              <a
                href="https://github.com/deedy5/ddgs"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                ddgs
              </a>{" "}
              library. It is a demo project meant to demonstrate that a search
              engine can be useful, transparent, and respectful of privacy.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              How we protect your IP address (the three-proxy trick)
            </h2>
            <p>
              Your real IP never reaches our backend or any external search API:
            </p>
            <ol className="list-decimal pl-5 mt-1 space-y-1">
              <li>
                Nginx rewrites the source IP to{" "}
                <code className="bg-gray-100 px-1 rounded">127.0.0.1</code>.
              </li>
              <li>Next.js proxies to Flask - again rewritten to loopback.</li>
              <li>The DDGS search library only sees the server's own IP.</li>
            </ol>
            <p className="mt-2">
              This means even our server logs (if we kept any - we don't) would
              show only localhost addresses. No external service can tie a
              search to your IP.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Analytics and cookies - straight talk
            </h2>
            <p>
              We use Google Analytics to count visitors.{" "}
              <strong>Pyxis itself sets zero cookies.</strong> Google Analytics
              may set its own first-party cookies as part of its standard
              tracking - those cookies are managed by Google, and we cannot read
              or access them. We only see the aggregated reports in the GA
              dashboard.
            </p>
            <p className="mt-2">If you prefer not to be counted, you can:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>
                Use a browser extension that blocks GA (e.g., uBlock Origin).
              </li>
              <li>Disable JavaScript (the search form still works).</li>
              <li>Run your own instance - the code is open source.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Why no "real" tracking?
            </h2>
            <p>
              Pyxis is not a business. It is a project by{" "}
              <Link href="/about" className="underline underline-offset-2">
                PyxLab
              </Link>
              , a small independent lab. We have no investors, no ad network,
              and no reason to collect your data. The only "data" we look at is
              how many people use the site (so we know if the server needs an
              upgrade).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Open source - you can verify everything
            </h2>
            <p>
              The entire codebase is on{" "}
              <a
                href="https://github.com/pyx-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                GitHub
              </a>
              . You can audit the proxy configuration, the Next.js middleware,
              and the Flask backend. If you don't trust our instance, run your
              own in minutes. This project is released under the{" "}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                GNU General Public License v3.0
              </a>
              .
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Built by PyxLab
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/images/pyxlab.png"
                alt="PyxLab"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <div>
                <p className="font-medium text-gray-900 text-sm">PyxLab</p>
                <p className="text-xs text-gray-500">
                  Honest and purposeful technology
                </p>
              </div>
            </div>
            <p>
              PyxLab builds tools that work for people, not against them. No
              dark patterns, no hidden data grabs. Just code you can read and
              trust.
            </p>
            <div className="mt-5">
              <a
                href="https://github.com/pyx-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded-full px-4 py-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
                github.com/pyx-lab
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
