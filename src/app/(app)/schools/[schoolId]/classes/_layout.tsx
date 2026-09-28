import { Stack } from "expo-router";

import { gluestackStackOptions } from "@/constants/navigation";

export default function ClassesLayout() {
    return (
        <Stack screenOptions={gluestackStackOptions}>
            <Stack.Screen
                name="index"
                options={{
                    title: "Turmas",
                }}
            />

            <Stack.Screen
                name="new"
                options={{
                    title: "Nova turma",
                }}
            />

            <Stack.Screen
                name="[classId]"
                options={{
                    title: "Editar turma",
                }}
            />
        </Stack>
    );
}