import { useLocalSearchParams, useRouter } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useEffect } from "react";
import { useSchoolStore } from "../../../../stores/school.store";

export default function SchoolPage() {
    const router = useRouter();

    const { schoolId } =
        useLocalSearchParams<{
            schoolId: string;
        }>();

    const school = useSchoolStore(
        (state) => state.selectedSchool
    );

    const loading = useSchoolStore(
        (state) => state.loadingSchool
    );

    const error = useSchoolStore(
        (state) => state.error
    );

    const fetchSchool = useSchoolStore(
        (state) => state.fetchSchool
    );

    useEffect(() => {
        if (!schoolId) {
            return;
        }

        fetchSchool(schoolId);
    }, [schoolId, fetchSchool]);

    if (loading) {
        return (
            <VStack className="flex-1 items-center justify-center bg-background">
                <Text>
                    Carregando escola...
                </Text>
            </VStack>
        );
    }

    if (error) {
        return (
            <VStack className="flex-1 bg-background px-5 pt-6">
                <Text className="text-error-600">
                    {error}
                </Text>
            </VStack>
        );
    }

    if (!school) {
        return (
            <VStack className="flex-1 items-center justify-center bg-background">
                <Text>
                    Escola não encontrada.
                </Text>
            </VStack>
        );
    }

    return (
        <VStack className="flex-1 bg-background px-5 pt-6">
            <VStack className="gap-1">
                <Heading size="2xl">
                    {school.name}
                </Heading>

                <Text className="text-typography-500">
                    {school.address}
                </Text>
            </VStack>

            <HStack className="mt-6 gap-3">
                <Card className="flex-1 rounded-2xl p-5">
                    <VStack>
                        <Text className="text-typography-500">
                            Turmas
                        </Text>

                        <Heading size="2xl">
                            {school.classesCount}
                        </Heading>
                    </VStack>
                </Card>

                <Card className="flex-1 rounded-2xl p-5">
                    <VStack>
                        <Text className="text-typography-500">
                            Alunos
                        </Text>

                        <Heading size="2xl">
                            {school.studentsCount}
                        </Heading>
                    </VStack>
                </Card>
            </HStack>

            <VStack className="mt-8 gap-4">
                <HStack className="items-center justify-between">
                    <VStack>
                        <Heading size="lg">
                            Turmas
                        </Heading>

                        <Text className="text-typography-500">
                            Gerencie as turmas da escola
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
                        <ButtonText>Nova</ButtonText>
                    </Button>
                </HStack>

                <Button
                    variant="outline"
                    onPress={() =>
                        router.push({
                            pathname: "/schools/[schoolId]/classes",
                            params: {
                                schoolId,
                            },
                        })
                    }
                >
                    <ButtonText>Ver todas as turmas</ButtonText>
                </Button>
            </VStack>
        </VStack>
    );
}