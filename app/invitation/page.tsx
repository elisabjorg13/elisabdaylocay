import type { Metadata } from "next";
import Link from "next/link";
import InvitationMapSection from "@/components/InvitationMapSection";
import type { JourneyStop } from "@/components/InvitationMap";

export const metadata: Metadata = {
  title: "Invitation",
  description: "Elisa's birthday journey.",
};

const dungeon =
  "https://www.google.com/maps/place/The+London+Dungeon/@51.5025119,-0.1213377,17z/data=!3m1!4b1!4m6!3m5!1s0x487604c70bc8d293:0x39108cb6fa0e39d9!8m2!3d51.5025119!4d-0.1187628!16zL20vMDI5bWIy?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D";
const hongKong = "https://www.google.com/maps/search/?api=1&query=51.477591%2C-0.050859";
const house =
  "https://www.google.com/maps/place/36+Ashmore+Cl,+London+SE15+5GY/@51.4764902,-0.0742523,17z/data=!3m1!4b1!4m6!3m5!1s0x48760374c238d601:0xdf15240fddde836c!8m2!3d51.4764902!4d-0.0716774!16s%2Fg%2F11cpnx93_c?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D";

const stops: JourneyStop[] = [
  { name: "London Dungeon", time: "15:15", lat: 51.5025119, lng: -0.1187628, href: dungeon },
  { name: "Hong Kong City", time: "20:30", lat: 51.477591, lng: -0.050859, href: hongKong },
  { name: "36 Ashmore Cl", time: "after the pub", lat: 51.4764902, lng: -0.0716774, href: house },
];

const letter = { fontFamily: '"Times New Roman", Times, serif' } as const;

export default function InvitationPage() {
  return (
    <main className="min-h-dvh bg-[#e00000] text-white">
      <header className="px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]" style={letter}>
        <h1 className="text-4xl leading-tight sm:text-5xl">
          SIKE! you are invited to Elisa&apos;s birthday journey and I want YOU to join 👉
        </h1>
      </header>

      <div className="grid h-[70vh] min-h-[520px] grid-cols-2">
        <section className="overflow-y-auto px-5 py-8" style={letter}>
          <h2 className="text-3xl">the program is as such</h2>
          <ol className="mt-6 space-y-6 text-2xl leading-snug">
            <li>
              <p>
                15:15{" "}
                <a className="underline" href={dungeon}>
                  London Dungeon
                </a>
              </p>
              <p className="mt-1 text-xl">50% discount on student bean</p>
            </li>
            <li>
              <p>
                20:30{" "}
                <a className="underline" href={hongKong}>
                  Hong Kong City
                </a>
              </p>
            </li>
            <li>
              <p>after that we go to a PUB</p>
              <p className="mt-1 text-xl">I&apos;ll update the website when I know lol</p>
            </li>
            <li>
              <p>
                and then OPEN decks and fireplace at my house{" "}
                <a className="underline" href={house}>
                  36 Ashmore Cl
                </a>
              </p>
            </li>
          </ol>
          <p className="mt-6 text-base text-white">
            The pins are London Dungeon, Hong Kong City, and the house. The pub is not on the map yet.
          </p>
        </section>
        <section className="h-full min-h-0" aria-label="Map of the places">
          <InvitationMapSection stops={stops} />
        </section>
      </div>

      <section
        className="mx-auto max-w-2xl px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-4"
        style={letter}
      >
        <p className="text-3xl leading-tight sm:text-4xl">
          During the day you can track me down{" "}
          <Link href="/" className="text-white underline">
            HERE!
          </Link>
        </p>
        <p className="mt-3 text-2xl leading-snug">
          I&apos;ll be updating it with my location as the day passes.
        </p>
        <p className="mt-8 text-3xl">Kisses and see you soon!</p>
        <p className="mt-6 text-2xl leading-snug">
          Gift ideas = a song sang, a performance performed, a little trick, a secret, a dove in the
          wind.. or a nice mug
        </p>
      </section>
    </main>
  );
}
