import { useRouter } from "expo-router";
import { FlatList, Pressable } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { School } from "@/domain/school/school";
import { useFetchSchools } from "@/hooks/use-fetch-schools";


export default function SchoolsPage() {
    const router = useRouter();

    const { schools, loading, error } = useFetchSchools();

    return (
        <VStack className="flex-1 bg-background px-5 pt-6">
            <HStack className="items-center justify-between">
                <VStack className="flex-1">
                    <Heading size="2xl">Escolas</Heading>

                    <Text className="mt-1 text-typography-500">
                        Gerencie as escolas cadastradas
                    </Text>
                </VStack>

                <Button
                    size="sm"
                    onPress={() => router.push("/schools/new")}
                >
                    <ButtonText>Nova escola</ButtonText>
                </Button>
            </HStack>

            <FlatList
                data={schools}
                keyExtractor={(school) => school.id}
                contentContainerStyle={{
                    paddingTop: 24,
                    paddingBottom: 32,
                }}
                ItemSeparatorComponent={() => (
                    <VStack className="h-3" />
                )}
                renderItem={({ item }: { item: School }) => (
                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/schools/[schoolId]",
                                params: {
                                    schoolId: item.id,
                                },
                            })
                        }
                    >
                        <Card className="rounded-2xl border border-outline-100 bg-background-50 p-5">
                            <VStack className="gap-3">
                                <VStack>
                                    <Heading size="md">
                                        {item.name}
                                    </Heading>

                                    <Text className="mt-1 text-typography-500">
                                        {item.address}
                                    </Text>
                                </VStack>

                                <HStack className="items-center justify-between">
                                    <Text className="text-sm text-typography-600">
                                        {item.classesCount}{" "}
                                        {item.classesCount === 1
                                            ? "turma"
                                            : "turmas"}
                                    </Text>

                                    <Text className="text-primary-600">
                                        Ver escola
                                    </Text>
                                </HStack>
                            </VStack>
                        </Card>
                    </Pressable>
                )}
            />
        </VStack>
    );
}