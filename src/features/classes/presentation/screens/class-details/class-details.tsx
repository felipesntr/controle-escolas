import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";

import { useClassStore } from "@/features/classes/stores/class.store";
import { useSchoolStore } from "@/features/schools/stores/school.store";
import { useFeedbackToast } from "@/shared/components/app-toast";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { LoadingBlock } from "@/shared/components/loading-block";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Heading } from "@/shared/components/ui/heading";
import { HStack } from "@/shared/components/ui/hstack";
import { AlertCircleIcon, InfoIcon } from "@/shared/components/ui/icon";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";

type ClassDetailsScreenProps = {
    schoolId: string;
    classId: string;
};

type DetailsTab = "alunos" | "informacoes";

export default function ClassDetailsScreen({
    schoolId,
    classId,
}: ClassDetailsScreenProps) {
    const router = useRouter();
    const navigation = useNavigation();
    const showToast = useFeedbackToast();
    const [tab, setTab] = useState<DetailsTab>("alunos");
    const [confirmDelete, setConfirmDelete] = useState(false);

    const selectedClass = useClassStore((state) => state.selectedClass);
    const loading = useClassStore((state) => state.loadingClass);
    const deleting = useClassStore((state) => state.deleting);
    const error = useClassStore((state) => state.error);
    const fetchClass = useClassStore((state) => state.fetchClass);
    const removeClass = useClassStore((state) => state.removeClass);
    const clearError = useClassStore((state) => state.clearError);

    const school = useSchoolStore((state) => state.selectedSchool);
    const fetchSchool = useSchoolStore((state) => state.fetchSchool);

    const visibleClass = selectedClass?.id === classId ? selectedClass : null;
    const visibleSchool = school?.id === schoolId ? school : null;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Detalhes da turma",
            headerRight: () => (
                <Pressable
                    accessibilityLabel="Editar turma"
                    onPress={() =>
                        router.push({
                            pathname: "/schools/[schoolId]/classes/[classId]/edit",
                            params: { schoolId, classId },
                        })
                    }
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name="create-outline" size={20} color="#2563eb" />
                </Pressable>
            ),
        });
    }, [navigation, router, schoolId, classId]);

    useEffect(() => {
        if (!schoolId || !classId) {
            return;
        }

        fetchClass(schoolId, classId);

        if (school?.id !== schoolId) {
            fetchSchool(schoolId);
        }
    }, [schoolId, classId, fetchClass, fetchSchool, school?.id]);

    async function handleDelete() {
        if (!schoolId || !classId) {
            return;
        }

        try {
            await removeClass(schoolId, classId);
            showToast("Turma excluída", `${visibleClass?.name ?? "A turma"} foi removida.`);
            router.replace({
                pathname: "/schools/[schoolId]/classes",
                params: { schoolId },
            });
        } catch {
            // O erro já está no Zustand.
        }
    }

    if (loading && !visibleClass) {
        return (
            <VStack className="flex-1 items-center justify-center bg-background px-8">
                <LoadingBlock label="Carregando turma..." />
            </VStack>
        );
    }

    if (error && !confirmDelete && !visibleClass) {
        return (
            <VStack className="flex-1 bg-background px-5 pt-6">
                <Alert variant="destructive">
                    <AlertIcon as={AlertCircleIcon} />
                    <AlertText>{error}</AlertText>
                </Alert>
            </VStack>
        );
    }

    if (!visibleClass) {
        return (
            <VStack className="flex-1 bg-background px-4 pt-4">
                <Alert>
                    <AlertIcon as={InfoIcon} />
                    <AlertText>Turma não encontrada.</AlertText>
                </Alert>
            </VStack>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
            <VStack className="rounded-2xl border border-border bg-white p-4">
                <HStack className="items-center gap-3">
                    <VStack className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Ionicons name="people-outline" size={22} color="#2563eb" />
                    </VStack>
                    <VStack className="flex-1">
                        <HStack className="items-center gap-2">
                            <Heading size="md">{visibleClass.name}</Heading>
                            <VStack className="rounded-full bg-green-100 px-2 py-0.5">
                                <Text size="xs" className="font-medium text-green-700">
                                    Ativa
                                </Text>
                            </VStack>
                        </HStack>
                        <Text size="sm" className="text-muted-foreground">
                            {visibleSchool?.name ?? "Escola"}
                        </Text>
                    </VStack>
                </HStack>

                <HStack className="mt-4 gap-2">
                    <Stat label="Ano/Série" value={visibleClass.grade} />
                    <Stat label="Turno" value={visibleClass.shift} />
                </HStack>
            </VStack>

            <HStack className="mt-4 rounded-2xl bg-white p-1">
                <TabButton
                    label="Alunos"
                    selected={tab === "alunos"}
                    onPress={() => setTab("alunos")}
                />
                <TabButton
                    label="Informações"
                    selected={tab === "informacoes"}
                    onPress={() => setTab("informacoes")}
                />
            </HStack>

            {tab === "alunos" ? (
                <VStack className="mt-4">
                    <Alert>
                        <AlertIcon as={InfoIcon} />
                        <AlertText>Nenhum aluno cadastrado nesta turma.</AlertText>
                    </Alert>
                </VStack>
            ) : (
                <VStack className="mt-4 gap-3 rounded-2xl border border-border bg-white p-4">
                    <InfoRow label="Nome" value={visibleClass.name} />
                    <InfoRow label="Ano/Série" value={visibleClass.grade} />
                    <InfoRow label="Turno" value={visibleClass.shift} />
                    <InfoRow label="Escola" value={visibleSchool?.name ?? "—"} />
                    <Pressable
                        onPress={() => {
                            clearError();
                            setConfirmDelete(true);
                        }}
                        className="mt-2 items-center rounded-xl bg-destructive/10 py-3"
                    >
                        <Text className="font-medium text-destructive">Excluir turma</Text>
                    </Pressable>
                </VStack>
            )}

            <ConfirmDialog
                visible={confirmDelete}
                title="Excluir turma?"
                description={`A turma "${visibleClass.name}" será removida.`}
                error={confirmDelete ? error : null}
                loading={deleting}
                onCancel={() => {
                    clearError();
                    setConfirmDelete(false);
                }}
                onConfirm={handleDelete}
            />
        </ScrollView>
    );
}

function TabButton({
    label,
    selected,
    onPress,
}: {
    label: string;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 items-center rounded-xl py-2 ${selected ? "bg-primary" : ""}`}
        >
            <Text
                size="sm"
                className={
                    selected ? "font-medium text-primary-foreground" : "text-muted-foreground"
                }
            >
                {label}
            </Text>
        </Pressable>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <VStack className="flex-1 items-center rounded-2xl bg-background py-3">
            <Text className="font-semibold text-foreground">{value}</Text>
            <Text size="xs" className="text-muted-foreground">
                {label}
            </Text>
        </VStack>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <VStack className="gap-1">
            <Text size="sm" className="text-muted-foreground">
                {label}
            </Text>
            <Text className="text-foreground">{value}</Text>
        </VStack>
    );
}
