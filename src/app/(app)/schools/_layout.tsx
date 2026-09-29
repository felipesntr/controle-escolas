import { Stack } from "expo-router";

import { gluestackStackOptions } from "@/shared/constants/navigation";

export default function SchoolsLayout() {
    return (
        <Stack screenOptions={gluestackStackOptions}>
            <Stack.Screen
                name="index"
                options={{
                    title: "Escolas",
                }}
            />

            <Stack.Screen
                name="new"
                options={{
                    title: "Nova escola",
                }}
            />

            <Stack.Screen
                name="[schoolId]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}