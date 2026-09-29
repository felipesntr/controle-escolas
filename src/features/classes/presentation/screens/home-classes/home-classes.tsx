import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView } from "react-native";

import type { Class } from "@/features/classes/domain/class";
import { useClassStore } from "@/features/classes/stores/class.store";
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

function matchesClass(item: Class, query: string) {
    return [item.name, item.grade, item.shift].some((value) =>
        value.toLowerCase().includes(query)
    );
}

type HomeClassesScreenProps = {
    schoolId: string;
};

export default function HomeClassesScreen({ schoolId }: HomeClassesScreenProps) {
    const router = useRouter();
    const navigation = useNavigation();
    const showToast = useFeedbackToast();
    const [classToDelete, setClassToDelete] = useState<Class | null>(null);
    const [menuClass, setMenuClass] = useState<Class | null>(null);

    const storedClasses = useClassStore((state) => state.classes);
    const classes = useMemo(
        () => storedClasses.filter((item) => item.schoolId === schoolId),
        [storedClasses, schoolId]
    );
    const loading = useClassStore((state) => state.loading);
    const error = useClassStore((state) => state.error);
    const deleting = useClassStore((state) => state.deleting);
    const fetchClasses = useClassStore((state) => state.fetchClasses);
    const removeClass = useClassStore((state) => state.removeClass);
    const clearError = useClassStore((state) => state.clearError);
    const school = useSchoolStore((state) => state.selectedSchool);
    const fetchSchool = useSchoolStore((state) => state.fetchSchool);
    const { query, setQuery, page, setPage, pageCount, pageItems, total } =
        usePagedList(classes, matchesClass);

    const visibleSchool = school?.id === schoolId ? school : null;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    accessibilityLabel="Nova turma"
                    onPress={() =>
                        router.push({
                            pathname: "/schools/[schoolId]/classes/new",
                            params: { schoolId },
                        })
                    }
                    className="mr-1 h-10 w-10 items-center justify-center rounded-full bg-primary"
                >
                    <Ionicons name="add" size={22} color="#ffffff" />
                </Pressable>
            ),
        });
    }, [navigation, router, schoolId]);

    async function confirmDelete() {
        if (!schoolId || !classToDelete) {
            return;
        }

        const deletedName = classToDelete.name;

        try {
            await removeClass(schoolId, classToDelete.id);
            setClassToDelete(null);
            showToast("Turma excluída", `${deletedName} foi removida.`);
        } catch {
            // O erro já está no Zustand.
        }
    }

    function openClass(classId: string) {
        router.push({
            pathname: "/schools/[schoolId]/classes/[classId]",
            params: { schoolId, classId },
        });
    }

    useEffect(() => {
        if (!schoolId) {
            return;
        }

        fetchClasses(schoolId);

        if (school?.id !== schoolId) {
            fetchSchool(schoolId);
        }
    }, [schoolId, fetchClasses, fetchSchool, school?.id]);

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            refreshControl={
                <RefreshControl
                    refreshing={loading && classes.length > 0}
                    onRefresh={() => fetchClasses(schoolId)}
                />
            }
        >
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/schools/[schoolId]",
                        params: { schoolId },
                    })
                }
                className="rounded-2xl border border-border bg-white p-4"
            >
                <HStack className="items-center gap-3">
                    <VStack className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                        <Ionicons name="business" size={20} color="#2563eb" />
                    </VStack>
                    <VStack className="flex-1">
                        <Text size="xs" className="text-muted-foreground">
                            Escola
                        </Text>
                        <Heading size="sm">
                            {visibleSchool?.name ?? "Carregando escola..."}
                        </Heading>
                        {visibleSchool ? (
                            <HStack className="items-center gap-1">
                                <Ionicons name="location-outline" size={12} color="#737373" />
                                <Text size="sm" className="text-muted-foreground">
                                    {visibleSchool.city}
                                </Text>
                            </HStack>
                        ) : null}
                    </VStack>
                </HStack>
            </Pressable>

            <Text size="sm" className="mt-4 font-medium text-foreground">
                Turmas ({total})
            </Text>

            <Input className="mt-3 h-12 rounded-xl bg-white">
                <InputSlot className="pl-3">
                    <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                    placeholder="Buscar turma..."
                    value={query}
                    onChangeText={setQuery}
                />
            </Input>

            {loading && classes.length === 0 ? (
                <VStack className="mt-6">
                    <LoadingBlock label="Carregando turmas..." />
                </VStack>
            ) : null}

            {error && !classToDelete ? (
                <Alert variant="destructive" className="mt-4">
                    <AlertIcon as={AlertCircleIcon} />
                    <AlertText>{error}</AlertText>
                </Alert>
            ) : null}

            {!loading || classes.length > 0 ? (
                <VStack className="mt-3 gap-3">
                    {pageItems.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() => openClass(item.id)}
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
                                <VStack className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500" />
                                <Pressable
                                    accessibilityLabel={`Ações de ${item.name}`}
                                    hitSlop={8}
                                    onPress={() => setMenuClass(item)}
                                >
                                    <Ionicons
                                        name="ellipsis-vertical"
                                        size={18}
                                        color="#737373"
                                    />
                                </Pressable>
                            </HStack>
                        </Pressable>
                    ))}

                    {total === 0 && !loading ? (
                        <Alert>
                            <AlertIcon as={InfoIcon} />
                            <AlertText>Nenhuma turma encontrada para esse filtro.</AlertText>
                        </Alert>
                    ) : null}

                    {total > 0 ? (
                        <TablePagination
                            page={page}
                            pageCount={pageCount}
                            onPageChange={setPage}
                        />
                    ) : null}

                    <Text size="sm" className="text-center text-muted-foreground">
                        {total} {total === 1 ? "turma encontrada" : "turmas encontradas"}
                    </Text>
                </VStack>
            ) : null}

            <ActionSheet
                visible={menuClass !== null}
                title={menuClass?.name ?? ""}
                subtitle="O que você deseja fazer?"
                onClose={() => setMenuClass(null)}
                actions={[
                    {
                        id: "view",
                        label: "Ver turma",
                        description: "Visualizar detalhes da turma",
                        icon: EyeIcon,
                        onPress: () => {
                            if (!menuClass) {
                                return;
                            }
                            const classId = menuClass.id;
                            setMenuClass(null);
                            openClass(classId);
                        },
                    },
                    {
                        id: "edit",
                        label: "Editar turma",
                        description: "Alterar informações da turma",
                        icon: EditIcon,
                        onPress: () => {
                            if (!menuClass) {
                                return;
                            }
                            const classId = menuClass.id;
                            setMenuClass(null);
                            router.push({
                                pathname: "/schools/[schoolId]/classes/[classId]/edit",
                                params: { schoolId, classId },
                            });
                        },
                    },
                    {
                        id: "delete",
                        label: "Excluir turma",
                        description: "Remover turma do sistema",
                        icon: TrashIcon,
                        tone: "danger",
                        onPress: () => {
                            if (!menuClass) {
                                return;
                            }
                            clearError();
                            setClassToDelete(menuClass);
                            setMenuClass(null);
                        },
                    },
                ]}
            />

            <ConfirmDialog
                visible={classToDelete !== null}
                title="Excluir turma?"
                description={
                    classToDelete ? `A turma "${classToDelete.name}" será removida.` : ""
                }
                error={classToDelete ? error : null}
                loading={deleting}
                onCancel={() => setClassToDelete(null)}
                onConfirm={confirmDelete}
            />
        </ScrollView>
    );
}
