import { Stack } from "expo-router";

import { gluestackStackOptions } from "@/constants/navigation";

export default function SchoolLayout() {
    return (
        <Stack screenOptions={gluestackStackOptions}>
            <Stack.Screen
                name="index"
                options={{
                    title: "Escola",
                }}
            />

            <Stack.Screen
                name="edit"
                options={{
                    title: "Editar escola",
                }}
            />

            <Stack.Screen
                name="classes"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}