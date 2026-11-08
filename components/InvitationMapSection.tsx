"use client";

import dynamic from "next/dynamic";
import type { JourneyStop } from "@/components/InvitationMap";

const InvitationMap = dynamic(() => import("@/components/InvitationMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#d9e4ea]" />,
});

export default function InvitationMapSection({ stops }: { stops: JourneyStop[] }) {
  return <InvitationMap stops={stops} />;
}
