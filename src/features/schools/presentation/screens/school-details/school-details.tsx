import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";

import { useFeedbackToast } from "@/shared/components/app-toast";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { LoadingBlock } from "@/shared/components/loading-block";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonIcon, ButtonText } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { HStack } from "@/shared/components/ui/hstack";
import {
    AddIcon,
    AlertCircleIcon,
    EditIcon,
    InfoIcon,
    MenuIcon,
    TrashIcon,
} from "@/shared/components/ui/icon";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";
import { useSchoolStore } from "@/shared/stores/school.store";

type SchoolDetailsScreenProps = {
    schoolId: string;
};

export default function SchoolDetailsScreen({
    schoolId,
}: SchoolDetailsScreenProps) {
    const router = useRouter();
    const navigation = useNavigation();
    const showToast = useFeedbackToast();

    const school = useSchoolStore(
        (state) => state.selectedSchool
    );

    const loading = useSchoolStore(
        (state) => state.loadingSchool
    );

    const error = useSchoolStore(
        (state) => state.error
    );

    const deleting = useSchoolStore((state) => state.deleting);

    const fetchSchool = useSchoolStore(
        (state) => state.fetchSchool
    );

    const removeSchool = useSchoolStore(
        (state) => state.removeSchool
    );

    const clearError = useSchoolStore(
        (state) => state.clearError
    );

    const [confirmDelete, setConfirmDelete] = useState(false);

    async function handleDelete() {
        if (!schoolId) {
            return;
        }

        try {
            await removeSchool(schoolId);
            showToast(
                "Escola excluída",
                "A escola e as turmas dela foram removidas."
            );
            router.replace("/schools");
        } catch {
            // O erro já está no Zustand.
        }
    }

    useLayoutEffect(() => {
        if (!school?.name) {
            return;
        }

        navigation.setOptions({ title: school.name });
    }, [navigation, school?.name]);

    useEffect(() => {
        if (!schoolId) {
            return;
        }

        fetchSchool(schoolId);
    }, [schoolId, fetchSchool]);

    if (loading) {
        return (
            <VStack className="flex-1 items-center justify-center bg-background px-8">
                <LoadingBlock label="Carregando escola..." />
            </VStack>
        );
    }

    if (error && !confirmDelete) {
        return (
            <VStack className="flex-1 bg-background px-5 pt-6">
                <Alert variant="destructive">
                    <AlertIcon as={AlertCircleIcon} />
                    <AlertText>{error}</AlertText>
                </Alert>
            </VStack>
        );
    }

    if (!school) {
        return (
            <VStack className="flex-1 bg-background px-4 pt-4">
                <Alert>
                    <AlertIcon as={InfoIcon} />
                    <AlertText>Escola não encontrada.</AlertText>
                </Alert>
            </VStack>
        );
    }

    return (
        <VStack className="flex-1 bg-background px-4 pt-4">
            <VStack className="gap-1">
                <Text className="text-typography-500">
                    {school.address}
                </Text>

                <Text className="text-typography-500">
                    {school.city}
                </Text>
            </VStack>

            <HStack className="mt-4 gap-3">
                <Button
                    className="flex-1"
                    size="sm"
                    variant="outline"
                    onPress={() =>
                        router.push({
                            pathname: "/schools/[schoolId]/edit",
                            params: {
                                schoolId,
                            },
                        })
                    }
                >
                    <ButtonIcon as={EditIcon} />
                    <ButtonText>Editar</ButtonText>
                </Button>

                <Button
                    className="flex-1"
                    size="sm"
                    variant="destructive"
                    onPress={() => {
                        clearError();
                        setConfirmDelete(true);
                    }}
                >
                    <ButtonIcon as={TrashIcon} />
                    <ButtonText>Excluir</ButtonText>
                </Button>
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
                        <ButtonIcon as={AddIcon} />
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
                    <ButtonIcon as={MenuIcon} />
                    <ButtonText>Ver todas as turmas</ButtonText>
                </Button>
            </VStack>

            <ConfirmDialog
                visible={confirmDelete}
                title="Excluir escola?"
                description={`A escola "${school.name}" e as turmas dela serão removidas.`}
                error={confirmDelete ? error : null}
                loading={deleting}
                onCancel={() => {
                    clearError();
                    setConfirmDelete(false);
                }}
                onConfirm={handleDelete}
            />
        </VStack>
    );
}
