import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useEffect } from "react";
import { useClassStore } from "../../../../../stores/class.store";

export default function ClassesPage() {

    const router = useRouter();

    const { schoolId } =
        useLocalSearchParams<{
            schoolId: string;
        }>();

    const classes = useClassStore(
        (state) => state.classes
    );

    const loading = useClassStore(
        (state) => state.loading
    );

    const error = useClassStore(
        (state) => state.error
    );

    const fetchClasses = useClassStore(
        (state) => state.fetchClasses
    );

    useEffect(() => {
        if (!schoolId) {
            return;
        }

        fetchClasses(schoolId);
    }, [schoolId, fetchClasses]);
    return (
        <VStack className="flex-1 bg-background px-5 pt-6">
            <HStack className="items-center justify-between">
                <VStack className="flex-1">
                    <Heading size="2xl">
                        Turmas
                    </Heading>

                    <Text className="mt-1 text-typography-500">
                        {classes.length} turmas cadastradas
                    </Text>
                </VStack>

                <Button
                    size="sm"
                    onPress={() =>
                        router.push({
                            pathname:
                                "/schools/[schoolId]/classes/new",
                            params: {
                                schoolId,
                            },
                        })
                    }
                >
                    <ButtonText>Nova turma</ButtonText>
                </Button>
            </HStack>

            <FlatList
                data={classes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingTop: 24,
                    paddingBottom: 32,
                }}
                ItemSeparatorComponent={() => (
                    <VStack className="h-3" />
                )}
                renderItem={({ item }) => (
                    <Pressable>
                        <Card className="rounded-2xl p-5">
                            <HStack className="items-center justify-between">
                                <VStack className="flex-1">
                                    <Heading size="md">
                                        {item.name}
                                    </Heading>

                                    <Text className="mt-1 text-typography-500">
                                        {item.level}
                                    </Text>

                                    <Text className="mt-3 text-sm text-typography-600">
                                        {item.studentsCount} alunos
                                    </Text>
                                </VStack>

                                <Text className="text-primary-600">
                                    →
                                </Text>
                            </HStack>
                        </Card>
                    </Pressable>
                )}
            />
        </VStack>
    );
}