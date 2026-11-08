import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InviteHeadline from "@/components/InviteHeadline";
import InvitationMapSection from "@/components/InvitationMapSection";
import type { JourneyStop } from "@/components/InvitationMap";

const blank = "\u00a0";

export const metadata: Metadata = {
  title: { absolute: blank },
  description: blank,
  openGraph: { title: blank, description: blank },
  twitter: { card: "summary", title: blank, description: blank },
};

const dungeon =
  "https://www.google.com/maps/place/The+London+Dungeon/@51.5025119,-0.1213377,17z/data=!3m1!4b1!4m6!3m5!1s0x487604c70bc8d293:0x39108cb6fa0e39d9!8m2!3d51.5025119!4d-0.1187628!16zL20vMDI5bWIy?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D";
const hongKong = "https://www.google.com/maps/search/?api=1&query=51.477591%2C-0.050859";
const pub =
  "https://www.google.com/maps/place/The+Dog+%26+Bell/@51.4833547,-0.0284138,17z/data=!3m1!4b1!4m6!3m5!1s0x487602f282f0f017:0x45e5b1e316f5c2d3!8m2!3d51.4833547!4d-0.0258389!16s%2Fg%2F1tcy3sfy?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D";
const house =
  "https://www.google.com/maps/place/36+Ashmore+Cl,+London+SE15+5GY/@51.4764902,-0.0742523,17z/data=!3m1!4b1!4m6!3m5!1s0x48760374c238d601:0xdf15240fddde836c!8m2!3d51.4764902!4d-0.0716774!16s%2Fg%2F11cpnx93_c?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D";

const stops: JourneyStop[] = [
  { name: "London Dungeon", time: "15:15", lat: 51.5025119, lng: -0.1187628, href: dungeon },
  { name: "Hong Kong City", time: "20:30", lat: 51.477591, lng: -0.050859, href: hongKong },
  { name: "Dog and Bell", time: "after dinner", lat: 51.4833547, lng: -0.0258389, href: pub },
  { name: "36 Ashmore Cl", time: "after the pub", lat: 51.4764902, lng: -0.0716774, href: house },
];

const letter = { fontFamily: '"Times New Roman", Times, serif' } as const;

export default function InvitationPage() {
  return (
    <main className="min-h-dvh bg-[#e00000] text-white">
      <header className="px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]" style={letter}>
        <InviteHeadline />
      </header>

      <div className="grid min-h-[70vh] grid-cols-2">
        <section className="px-5 py-8" style={letter}>
          <h2 className="text-3xl">the program is as such</h2>
          <ol className="mt-6 space-y-6 text-2xl leading-snug">
            <li className="flex items-start gap-3">
              <div>
                <p>
                  15:15{" "}
                  <a className="underline" href={dungeon}>
                    London Dungeon
                  </a>
                </p>
                <p className="mt-1 text-xl">50% discount on student bean</p>
              </div>
              <Image
                src="/london-dungeon.jpg"
                alt="The London Dungeon"
                width={224}
                height={192}
                className="h-24 w-28 shrink-0 object-cover"
              />
            </li>
            <li className="flex items-start gap-3">
              <div>
                <p>
                  20:30{" "}
                  <a className="underline" href={hongKong}>
                    dinner at Hong Kong City
                  </a>
                </p>
              </div>
              <Image
                src="/hong-kong-city.jpg"
                alt="Hong Kong City"
                width={224}
                height={192}
                className="h-24 w-28 shrink-0 object-cover"
              />
            </li>
            <li>
              <p>
                after that we go to{" "}
                <a className="underline" href={pub}>
                  Dog and Bell
                </a>
              </p>
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
        </section>
        <section className="relative h-full min-h-0" aria-label="Map of the places">
          <InvitationMapSection stops={stops} />
          <p className="sike-sticker">SIKE!</p>
        </section>
      </div>

      <section
        className="px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 text-left"
        style={letter}
      >
        <p className="text-lg leading-snug">
          let me know if you wanna come to the DUNGEON or if you will be pulling up after to the
          dinner and drinks!!
        </p>
        <p className="mt-4 text-lg leading-snug">
          During the day you can track me down{" "}
          <Link href="/" className="text-white underline">
            HERE!
          </Link>
        </p>
        <p className="mt-2 text-base leading-snug">
          I&apos;ll be updating it with my location as the day passes.
        </p>
        <p className="mt-4 text-lg">Kisses and see you soon!</p>
        <p className="mt-3 text-base leading-snug">
          Gift ideas = a song sang, a performance performed, a little trick, a secret, a dove in the
          wind.. or a nice mug
        </p>
      </section>
    </main>
  );
}
