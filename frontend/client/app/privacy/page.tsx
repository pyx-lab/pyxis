import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Pyxis collects no personal data. No logs, no tracking, no cookies. Here is exactly what that means.",
};

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Honest version. No legal fluff.</p>

        <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">We collect nothing about you</h2>
            <p>
              Pyxis does not collect, store, or process any personal data. No IP addresses,
              no search queries, no cookies, no fingerprinting, no session tracking. When you
              search, the request goes to the backend, results come back, and nothing is kept.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">No logs</h2>
            <p>
              We do not keep server logs of searches or user activity. There is no database of
              who searched for what. We cannot hand over data we do not have.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Google Search Console</h2>
            <p>
              We use Google Search Console to see aggregate traffic metrics: how many times the
              site appeared in Google search results and which pages were indexed. This is a
              webmaster tool, not an analytics tool. It does not track individual visitors or
              their behavior on Pyxis. We see counts, not people.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">No third-party trackers</h2>
            <p>
              There are no analytics scripts, no ad networks, no social pixels, no third-party
              tracking of any kind embedded in Pyxis.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Open source</h2>
            <p>
              Pyxis is open source. You do not have to take our word for any of this. You can
              read the code, run your own instance, and verify exactly what happens when you
              search. Self-hosting is encouraged.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">This is a demo project</h2>
            <p>
              Pyxis is built and maintained by{" "}
              <Link href="/about" className="underline underline-offset-2 hover:text-gray-900 transition-colors">
                PyxLab
              </Link>
              {" "}as an experimental, open-source project. It is not a commercial service.
              There is no company behind it collecting data to monetize later.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Contact</h2>
            <p>
              Questions about privacy? Open an issue or start a discussion on the{" "}
              <a
                href="https://github.com/pyx-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-gray-900 transition-colors"
              >
                PyxLab GitHub
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 px-6 py-5 flex items-center justify-center gap-6">
        <span className="text-xs text-gray-400">© {new Date().getFullYear()} PyxLab</span>
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Home</Link>
        <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Terms</Link>
        <Link href="/about" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">About</Link>
      </footer>
    </div>
  );
}
