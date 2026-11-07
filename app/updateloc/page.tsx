import type { Metadata } from "next";
import UpdateLocation from "@/components/UpdateLocation";

export const metadata: Metadata = { title: "Update location" };

export default function UpdatePage() {
  return <UpdateLocation />;
}
