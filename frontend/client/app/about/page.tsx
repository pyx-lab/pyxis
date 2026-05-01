import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Pyxis is an open-source search engine by PyxLab, built with a vision for honest and purposeful technology.",
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">About Pyxis</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            An open-source search engine. No tracking. No ads. No agenda.
          </p>
        </div>

        <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">What it is</h2>
            <p>
              Pyxis is a self-hostable, open-source search engine that lets you search the
              web, images, videos, news, and books from a single interface. It is a demo
              project, something built to explore what a more honest search experience
              could look like, and to give people a reference they can actually run themselves.
            </p>
            <p className="mt-3">
              Under the hood, Pyxis uses{" "}
              <a
                href="https://github.com/deedy5/ddgs"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-gray-900 transition-colors"
              >
                ddgs
              </a>
              {" "}(DDGS | Dux Distributed Global Search), a metasearch library that
              aggregates results from diverse web search services. Depending on the search
              type, backends include Bing, Brave, DuckDuckGo, Google, Grokipedia, Mojeek,
              Yahoo, Yandex, Wikipedia, and Anna's Archive for books. The backend is selected
              automatically. Pyxis is not tied to any single engine.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Why it exists</h2>
            <p>
              Most search engines are built around attention and advertising. The result is
              an experience optimized for engagement rather than usefulness. Pyxis is an
              attempt to build the opposite: a tool that simply finds things, stores nothing
              about you, and gets out of the way.
            </p>
            <p className="mt-3">
              It is not trying to replace Google. It is trying to show that a search engine
              does not have to be a surveillance platform.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Open source</h2>
            <p>
              Pyxis is fully open source. You can read the code, understand exactly what it
              does, report issues, contribute improvements, or run your own instance. That
              transparency is not a feature we added. It is the point.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">No tracking. Really.</h2>
            <p>
              No search queries are stored. No IP addresses are logged. No cookies are set.
              No profiles are built. We use Google Search Console to see aggregate site
              traffic (how many times the site appeared in results) but that is a
              webmaster tool, not analytics. We see numbers, not people.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Built by PyxLab</h2>
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
                <p className="text-xs text-gray-500">Honest and purposeful technology</p>
              </div>
            </div>
            <p>
              PyxLab is a small, independent lab focused on building technology that is
              transparent about what it does and honest about what it is. No growth hacking,
              no dark patterns, no pretending a demo is a product. If something is
              experimental, we say so. If something does not work perfectly yet, we do not
              hide it.
            </p>
            <p className="mt-3">
              Pyxis is one of those experiments, released openly so others can learn from
              it, improve it, or just use it.
            </p>
            <div className="mt-5">
              <a
                href="https://github.com/pyx-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded-full px-4 py-2"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
                github.com/pyx-lab
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 px-6 py-5 flex items-center justify-center gap-6">
        <span className="text-xs text-gray-400">© {new Date().getFullYear()} PyxLab</span>
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Home</Link>
        <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Privacy</Link>
        <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Terms</Link>
      </footer>
    </div>
  );
}
