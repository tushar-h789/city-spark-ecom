"use server";

import { headers } from "next/headers";

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDeviceType() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  const isMobile = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  return {
    isMobile: Boolean(isMobile),
    isDesktop: !isMobile,
  };
}
