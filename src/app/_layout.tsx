import "@/src/global.css";

import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useEffect, useState } from "react";

import { enableMockServer } from "@/mocks/enable-mock-server";

export default function RootLayout() {
  const [mockReady, setMockReady] = useState(!__DEV__);

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    enableMockServer().then(() => {
      setMockReady(true);
    });
  }, []);

  if (!mockReady) {
    return null;
  }
  return (
    <GluestackUIProvider mode="light">
      <Stack />
    </GluestackUIProvider>
  );
}