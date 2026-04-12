"use client";

import { InterwovenKitProvider } from "@initia/interwovenkit-react";
import { initiaConfig } from "@/lib/initia-config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InterwovenKitProvider {...initiaConfig}>
      {children}
    </InterwovenKitProvider>
  );
}
