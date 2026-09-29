import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
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

type SchoolDetailsScreenProps = {
    schoolId: string;
};

type DetailsTab = "turmas" | "informacoes" | "endereco";

const TABS: { id: DetailsTab; label: string }[] = [
    { id: "turmas", label: "Turmas" },
    { id: "informacoes", label: "Informações" },
    { id: "endereco", label: "Endereço" },
];

export default function SchoolDetailsScreen({ schoolId }: SchoolDetailsScreenProps) {
    const router = useRouter();
    const navigation = useNavigation();
    const showToast = useFeedbackToast();
    const [tab, setTab] = useState<DetailsTab>("turmas");
    const [confirmDelete, setConfirmDelete] = useState(false);

    const school = useSchoolStore((state) => state.selectedSchool);
    const loading = useSchoolStore((state) => state.loadingSchool);
    const error = useSchoolStore((state) => state.error);
    const deleting = useSchoolStore((state) => state.deleting);
    const fetchSchool = useSchoolStore((state) => state.fetchSchool);
    const removeSchool = useSchoolStore((state) => state.removeSchool);
    const clearError = useSchoolStore((state) => state.clearError);

    const storedClasses = useClassStore((state) => state.classes);
    const classes = useMemo(
        () => storedClasses.filter((item) => item.schoolId === schoolId),
        [storedClasses, schoolId]
    );
    const loadingClasses = useClassStore((state) => state.loading);
    const fetchClasses = useClassStore((state) => state.fetchClasses);

    const visibleSchool = school?.id === schoolId ? school : null;
    const classTotal = visibleSchool?.classCount ?? classes.length;

    async function handleDelete() {
        if (!schoolId) {
            return;
        }

        try {
            await removeSchool(schoolId);
            showToast("Escola excluída", "A escola e as turmas dela foram removidas.");
            router.replace("/schools");
        } catch {
            // O erro já está no Zustand.
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Detalhes da escola",
            headerRight: () => (
                <Pressable
                    accessibilityLabel="Editar escola"
                    onPress={() =>
                        router.push({
                            pathname: "/schools/[schoolId]/edit",
                            params: { schoolId },
                        })
                    }
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name="create-outline" size={20} color="#2563eb" />
                </Pressable>
            ),
        });
    }, [navigation, router, schoolId]);

    useEffect(() => {
        if (!schoolId) {
            return;
        }

        fetchSchool(schoolId);
        fetchClasses(schoolId);
    }, [schoolId, fetchSchool, fetchClasses]);

    if (loading && !visibleSchool) {
        return (
            <VStack className="flex-1 items-center justify-center bg-background px-8">
                <LoadingBlock label="Carregando escola..." />
            </VStack>
        );
    }

    if (error && !confirmDelete && !visibleSchool) {
        return (
            <VStack className="flex-1 bg-background px-5 pt-6">
                <Alert variant="destructive">
                    <AlertIcon as={AlertCircleIcon} />
                    <AlertText>{error}</AlertText>
                </Alert>
            </VStack>
        );
    }

    if (!visibleSchool) {
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
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
            <VStack className="rounded-2xl border border-border bg-white p-4">
                <HStack className="items-center gap-3">
                    <VStack className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Ionicons name="business" size={22} color="#2563eb" />
                    </VStack>
                    <VStack className="flex-1">
                        <Heading size="md">{visibleSchool.name}</Heading>
                        <HStack className="items-center gap-1">
                            <Ionicons name="location-outline" size={13} color="#737373" />
                            <Text size="sm" className="text-muted-foreground">
                                {visibleSchool.address}
                            </Text>
                        </HStack>
                        <Text size="sm" className="text-muted-foreground">
                            {visibleSchool.city}
                        </Text>
                    </VStack>
                </HStack>

                <VStack className="mt-4 items-center rounded-2xl bg-background py-3">
                    <Text className="text-lg font-semibold text-foreground">{classTotal}</Text>
                    <Text size="sm" className="text-muted-foreground">
                        {classTotal === 1 ? "Turma" : "Turmas"}
                    </Text>
                </VStack>
            </VStack>

            <HStack className="mt-4 rounded-2xl bg-white p-1">
                {TABS.map((item) => {
                    const selected = tab === item.id;

                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => setTab(item.id)}
                            className={`flex-1 items-center rounded-xl py-2 ${
                                selected ? "bg-primary" : ""
                            }`}
                        >
                            <Text
                                size="sm"
                                className={
                                    selected
                                        ? "font-medium text-primary-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </HStack>

            {tab === "turmas" ? (
                <VStack className="mt-4 gap-3">
                    <HStack className="items-center justify-between">
                        <Heading size="sm">Turmas</Heading>
                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname: "/schools/[schoolId]/classes/new",
                                    params: { schoolId },
                                })
                            }
                            className="flex-row items-center gap-1 rounded-full bg-primary px-3 py-2"
                        >
                            <Ionicons name="add" size={16} color="#ffffff" />
                            <Text size="sm" className="font-medium text-primary-foreground">
                                Nova turma
                            </Text>
                        </Pressable>
                    </HStack>

                    {loadingClasses && classes.length === 0 ? (
                        <LoadingBlock label="Carregando turmas..." />
                    ) : null}

                    {classes.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() =>
                                router.push({
                                    pathname: "/schools/[schoolId]/classes/[classId]",
                                    params: { schoolId, classId: item.id },
                                })
                            }
                            className="rounded-2xl border border-border bg-white p-4"
                        >
                            <HStack className="items-center gap-3">
                                <VStack className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Ionicons name="people-outline" size={18} color="#2563eb" />
                                </VStack>
                                <VStack className="flex-1">
                                    <Text className="font-semibold">{item.name}</Text>
                                    <Text size="sm" className="text-muted-foreground">
                                        {item.shift}
                                    </Text>
                                </VStack>
                                <Ionicons name="chevron-forward" size={16} color="#a3a3a3" />
                            </HStack>
                        </Pressable>
                    ))}

                    {!loadingClasses && classes.length === 0 ? (
                        <Alert>
                            <AlertIcon as={InfoIcon} />
                            <AlertText>Nenhuma turma cadastrada.</AlertText>
                        </Alert>
                    ) : null}

                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/schools/[schoolId]/classes",
                                params: { schoolId },
                            })
                        }
                        className="items-center py-2"
                    >
                        <Text className="font-medium text-primary">Ver todas as turmas</Text>
                    </Pressable>
                </VStack>
            ) : null}

            {tab === "informacoes" ? (
                <VStack className="mt-4 gap-3 rounded-2xl border border-border bg-white p-4">
                    <InfoRow label="Nome" value={visibleSchool.name} />
                    <InfoRow label="Cidade" value={visibleSchool.city} />
                    <InfoRow
                        label="Turmas"
                        value={`${classTotal} ${classTotal === 1 ? "turma" : "turmas"}`}
                    />
                    <Pressable
                        onPress={() => {
                            clearError();
                            setConfirmDelete(true);
                        }}
                        className="mt-2 items-center rounded-xl bg-destructive/10 py-3"
                    >
                        <Text className="font-medium text-destructive">Excluir escola</Text>
                    </Pressable>
                </VStack>
            ) : null}

            {tab === "endereco" ? (
                <VStack className="mt-4 gap-3 rounded-2xl border border-border bg-white p-4">
                    <InfoRow label="Endereço" value={visibleSchool.address} />
                    <InfoRow label="Cidade" value={visibleSchool.city} />
                </VStack>
            ) : null}

            <ConfirmDialog
                visible={confirmDelete}
                title="Excluir escola?"
                description={`A escola "${visibleSchool.name}" e as turmas dela serão removidas.`}
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
