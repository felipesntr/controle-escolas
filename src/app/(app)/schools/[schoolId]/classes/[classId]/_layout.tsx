import { Stack } from "expo-router";

import { gluestackStackOptions } from "@/shared/constants/navigation";

export default function ClassLayout() {
    return (
        <Stack screenOptions={gluestackStackOptions}>
            <Stack.Screen
                name="index"
                options={{
                    title: "Detalhes da turma",
                }}
            />

            <Stack.Screen
                name="edit"
                options={{
                    title: "Editar turma",
                }}
            />
        </Stack>
    );
}
