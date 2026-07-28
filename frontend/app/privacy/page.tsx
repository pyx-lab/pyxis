import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Pyxis collects no personal data. Your IP is masked at every layer. Here is exactly how.",
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Honest version. No legal fluff.
        </p>

        <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Your IP address is never exposed to the backend
            </h2>
            <p>
              We take several steps to ensure your real IP address never reaches
              any of the services we query:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Nginx reverse proxy</strong> - Every incoming request
                has its IP rewritten to{" "}
                <code className="bg-gray-100 px-1 rounded">127.0.0.1</code>{" "}
                (loopback) before being passed to Next.js.
              </li>
              <li>
                <strong>Next.js proxy</strong> - When the Next.js frontend calls
                the Python Flask backend, it again rewrites the source IP to
                <code className="bg-gray-100 px-1 rounded">127.0.0.1</code>.
              </li>
              <li>
                <strong>DDGS (search backend)</strong> - The underlying search
                library only sees the server's own IP address, never your
                original IP.
              </li>
            </ul>
            <p className="mt-3">
              This means that even if we wanted to log IPs (we don't), we
              physically cannot see your real one. The same applies to any
              external service we call - they only see our server.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              No search logs, no personal data storage
            </h2>
            <p>
              Pyxis does not store your search queries, IP addresses, browser
              fingerprints, or any other identifier. There is no database of
              "who searched for what". The only thing that persists across
              requests is the in-memory Redis cache for search results
              (which contains no user data).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              No third-party trackers
            </h2>
            <p>
              Pyxis embeds zero tracking scripts, no analytics, no ad networks,
              and no social media pixels. No cookies of any kind are set by
              Pyxis. Every external request is proxied server-side so no
              third party ever sees your browser or IP address.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Open source and self-hosting
            </h2>
            <p>
              Pyxis is 100% open source under the{" "}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-gray-900"
              >
                GNU General Public License v3.0
              </a>
              . You can inspect the code, build your own image, and run an
              instance that runs entirely on your own hardware. We encourage
              self-hosting as the ultimate privacy solution.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              This is a demo project
            </h2>
            <p>
              Pyxis is built and maintained by{" "}
              <Link
                href="/about"
                className="underline underline-offset-2 hover:text-gray-900"
              >
                PyxLab
              </Link>{" "}
              as an experimental, non-commercial project. No data is sold, and
              there are no hidden business interests.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Contact
            </h2>
            <p>
              Questions or concerns? Open an issue on{" "}
              <a
                href="https://github.com/pyx-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-gray-900"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
