import "@/src/global.css";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { enableMockServer } from "@/mocks/enable-mock-server";
import { LoadingBlock } from "@/shared/components/loading-block";
import { GluestackUIProvider } from "@/shared/components/ui/gluestack-ui-provider";
import { VStack } from "@/shared/components/ui/vstack";
import { screenBackground } from "@/shared/constants/navigation";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [mockReady, setMockReady] = useState(!__DEV__);
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    enableMockServer()
      .catch((error: unknown) => {
        console.error(error);
      })
      .finally(() => {
        setMockReady(true);
      });
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!mockReady) {
    return (
      <GluestackUIProvider mode="light">
        <VStack className="flex-1 items-center justify-center bg-background px-8">
          <LoadingBlock label="Preparando o aplicativo..." />
        </VStack>
      </GluestackUIProvider>
    );
  }
  return (
    <GluestackUIProvider mode="light">
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: screenBackground },
        }}
      />
    </GluestackUIProvider>
  );
}