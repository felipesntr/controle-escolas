import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { School } from "@/features/schools/domain/school";
import { useFetchSchools } from "@/features/schools/hooks/use-fetch-schools";
import { useSchoolStore } from "@/features/schools/stores/school.store";
import { ActionSheet } from "@/shared/components/action-sheet";
import { useFeedbackToast } from "@/shared/components/app-toast";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { LoadingBlock } from "@/shared/components/loading-block";
import { TablePagination } from "@/shared/components/table-pagination";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Heading } from "@/shared/components/ui/heading";
import { HStack } from "@/shared/components/ui/hstack";
import {
    AlertCircleIcon,
    EditIcon,
    EyeIcon,
    InfoIcon,
    SearchIcon,
    TrashIcon,
} from "@/shared/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/shared/components/ui/input";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";
import { usePagedList } from "@/shared/hooks/use-paged-list";

function matchesSchool(school: School, query: string) {
    return [school.name, school.address, school.city].some((value) =>
        value.toLowerCase().includes(query)
    );
}

export default function HomeSchoolsScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
    const [menuSchool, setMenuSchool] = useState<School | null>(null);

    const { schools, loading, error } = useFetchSchools();
    const fetchSchools = useSchoolStore((state) => state.fetchSchools);
    const showToast = useFeedbackToast();
    const deleting = useSchoolStore((state) => state.deleting);
    const removeSchool = useSchoolStore((state) => state.removeSchool);
    const clearError = useSchoolStore((state) => state.clearError);
    const { query, setQuery, page, setPage, pageCount, pageItems, total } =
        usePagedList(schools, matchesSchool);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    async function confirmDelete() {
        if (!schoolToDelete) {
            return;
        }

        const deletedName = schoolToDelete.name;

        try {
            await removeSchool(schoolToDelete.id);
            setSchoolToDelete(null);
            showToast(
                "Escola excluída",
                `${deletedName} e as turmas dela foram removidas.`
            );
        } catch {
            // O erro já está no Zustand.
        }
    }

    function openSchool(schoolId: string) {
        router.push({
            pathname: "/schools/[schoolId]",
            params: { schoolId },
        });
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{
                paddingTop: insets.top + 12,
                paddingHorizontal: 16,
                paddingBottom: 32,
            }}
            refreshControl={
                <RefreshControl
                    refreshing={loading && schools.length > 0}
                    onRefresh={() => fetchSchools()}
                />
            }
        >
            <HStack className="items-center justify-between">
                <Heading size="xl">Escolas</Heading>
                <Pressable
                    accessibilityLabel="Nova escola"
                    onPress={() => router.push("/schools/new")}
                    className="h-11 w-11 items-center justify-center rounded-full bg-primary"
                >
                    <Ionicons name="add" size={24} color="#ffffff" />
                </Pressable>
            </HStack>
            <Text className="mt-1 text-muted-foreground">
                Gerencie suas escolas cadastradas.
            </Text>

            <Input className="mt-4 h-12 rounded-xl bg-white">
                <InputSlot className="pl-3">
                    <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                    placeholder="Buscar por nome, endereço ou cidade..."
                    value={query}
                    onChangeText={setQuery}
                />
            </Input>

            <Text size="sm" className="mt-4 text-muted-foreground">
                {total}{" "}
                {query.trim()
                    ? total === 1
                        ? "escola encontrada"
                        : "escolas encontradas"
                    : total === 1
                      ? "escola cadastrada"
                      : "escolas cadastradas"}
            </Text>

            {loading && schools.length === 0 ? (
                <VStack className="mt-6">
                    <LoadingBlock label="Carregando escolas..." />
                </VStack>
            ) : null}

            {error && !schoolToDelete ? (
                <Alert variant="destructive" className="mt-4">
                    <AlertIcon as={AlertCircleIcon} />
                    <AlertText>{error}</AlertText>
                </Alert>
            ) : null}

            {!loading || schools.length > 0 ? (
                <VStack className="mt-3 gap-3">
                    {pageItems.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() => openSchool(item.id)}
                            className="rounded-2xl border border-border bg-white p-4"
                        >
                            <HStack className="items-start gap-3">
                                <VStack className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                                    <Ionicons name="business" size={20} color="#2563eb" />
                                </VStack>
                                <Text className="flex-1 pt-2 font-semibold text-foreground">
                                    {item.name}
                                </Text>
                                <Pressable
                                    accessibilityLabel={`Ações de ${item.name}`}
                                    hitSlop={8}
                                    onPress={() => setMenuSchool(item)}
                                >
                                    <Ionicons
                                        name="ellipsis-vertical"
                                        size={18}
                                        color="#737373"
                                    />
                                </Pressable>
                            </HStack>

                            <HStack className="mt-3 items-center gap-2">
                                <Ionicons name="location-outline" size={14} color="#737373" />
                                <Text size="sm" className="flex-1 text-muted-foreground">
                                    {item.address}
                                </Text>
                            </HStack>
                            <Text size="sm" className="ml-6 text-muted-foreground">
                                {item.city}
                            </Text>

                            <HStack className="mt-3 items-center justify-between">
                                <HStack className="items-center gap-2">
                                    <Ionicons name="people-outline" size={14} color="#737373" />
                                    <Text size="sm" className="text-muted-foreground">
                                        {item.classCount ?? 0}{" "}
                                        {(item.classCount ?? 0) === 1 ? "turma" : "turmas"}
                                    </Text>
                                </HStack>
                                <Ionicons name="chevron-forward" size={16} color="#a3a3a3" />
                            </HStack>
                        </Pressable>
                    ))}

                    {total === 0 && !loading ? (
                        <Alert>
                            <AlertIcon as={InfoIcon} />
                            <AlertText>
                                Nenhuma escola encontrada para esse filtro.
                            </AlertText>
                        </Alert>
                    ) : null}

                    {total > 0 ? (
                        <TablePagination
                            page={page}
                            pageCount={pageCount}
                            onPageChange={setPage}
                        />
                    ) : null}
                </VStack>
            ) : null}

            <ActionSheet
                visible={menuSchool !== null}
                title={menuSchool?.name ?? ""}
                subtitle="O que você deseja fazer?"
                onClose={() => setMenuSchool(null)}
                actions={[
                    {
                        id: "view",
                        label: "Ver escola",
                        description: "Visualizar detalhes da escola",
                        icon: EyeIcon,
                        onPress: () => {
                            if (!menuSchool) {
                                return;
                            }
                            const schoolId = menuSchool.id;
                            setMenuSchool(null);
                            openSchool(schoolId);
                        },
                    },
                    {
                        id: "edit",
                        label: "Editar escola",
                        description: "Alterar informações da escola",
                        icon: EditIcon,
                        onPress: () => {
                            if (!menuSchool) {
                                return;
                            }
                            const schoolId = menuSchool.id;
                            setMenuSchool(null);
                            router.push({
                                pathname: "/schools/[schoolId]/edit",
                                params: { schoolId },
                            });
                        },
                    },
                    {
                        id: "delete",
                        label: "Excluir escola",
                        description: "Remover escola do sistema",
                        icon: TrashIcon,
                        tone: "danger",
                        onPress: () => {
                            if (!menuSchool) {
                                return;
                            }
                            clearError();
                            setSchoolToDelete(menuSchool);
                            setMenuSchool(null);
                        },
                    },
                ]}
            />

            <ConfirmDialog
                visible={schoolToDelete !== null}
                title="Excluir escola?"
                description={
                    schoolToDelete
                        ? `A escola "${schoolToDelete.name}" e as turmas dela serão removidas.`
                        : ""
                }
                error={schoolToDelete ? error : null}
                loading={deleting}
                onCancel={() => setSchoolToDelete(null)}
                onConfirm={confirmDelete}
            />
        </ScrollView>
    );
}
