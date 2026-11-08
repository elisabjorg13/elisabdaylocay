"use client";

import { useEffect, useState } from "react";

const headline =
  "This Friday 13th of november you are invited to Elisa's birthday journey and I want YOU to join";

export default function InviteHeadline() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShow(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <h1 className="text-xl leading-snug sm:text-2xl" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      {show ? headline : "\u00a0"}
    </h1>
  );
}
