import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView } from "react-native";

import type { Class } from "@/features/classes/domain/class";
import { ActionsMenu } from "@/shared/components/actions-menu";
import { useFeedbackToast } from "@/shared/components/app-toast";
import { createClassRowActions } from "@/shared/components/class-row-actions";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { LoadingBlock } from "@/shared/components/loading-block";
import { TablePagination } from "@/shared/components/table-pagination";
import { Alert, AlertIcon, AlertText } from "@/shared/components/ui/alert";
import { Button, ButtonIcon } from "@/shared/components/ui/button";
import {
    AddIcon,
    AlertCircleIcon,
    InfoIcon,
    RefreshCwIcon,
    SearchIcon,
} from "@/shared/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/shared/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableData,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Text } from "@/shared/components/ui/text";
import { VStack } from "@/shared/components/ui/vstack";
import { usePagedList } from "@/shared/hooks/use-paged-list";
import { useClassStore } from "@/shared/stores/class.store";
import { Div } from "@expo/html-elements";

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

    const classes = useClassStore((state) => state.classes);
    const loading = useClassStore((state) => state.loading);
    const error = useClassStore((state) => state.error);
    const deleting = useClassStore((state) => state.deleting);
    const fetchClasses = useClassStore((state) => state.fetchClasses);
    const removeClass = useClassStore((state) => state.removeClass);
    const clearError = useClassStore((state) => state.clearError);
    const [classToDelete, setClassToDelete] = useState<Class | null>(null);
    const { query, setQuery, page, setPage, pageCount, pageItems, total } =
        usePagedList(classes, matchesClass);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <Button
                        size="icon"
                        variant="ghost"
                        accessibilityLabel="Recarregar"
                        disabled={loading || !schoolId}
                        onPress={() => {
                            if (schoolId) {
                                fetchClasses(schoolId);
                            }
                        }}
                    >
                        <ButtonIcon as={RefreshCwIcon} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        accessibilityLabel="Nova turma"
                        onPress={() =>
                            router.push({
                                pathname: "/schools/[schoolId]/classes/new",
                                params: { schoolId },
                            })
                        }
                    >
                        <ButtonIcon as={AddIcon} />
                    </Button>
                </>
            ),
        });
    }, [navigation, router, schoolId, fetchClasses, loading]);

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

    useEffect(() => {
        if (!schoolId) {
            return;
        }

        fetchClasses(schoolId);
    }, [schoolId, fetchClasses]);

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
            <Text className="text-typography-500">
                {classes.length} turmas cadastradas
            </Text>

            <Input className="mt-4">
                <InputSlot className="pl-3">
                    <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                    placeholder="Filtrar por nome, ano ou turno"
                    value={query}
                    onChangeText={setQuery}
                />
            </Input>

            {loading ? (
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

            {!loading ? (
                <VStack className="mt-5">
                    <ScrollView horizontal>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Ano/Série</TableHead>
                                    <TableHead>Turno</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageItems.map((item) => (
                                    <TableRow key={item.id} onPress={() => router.push({
                                        pathname: "/schools/[schoolId]/classes/[classId]",
                                        params: {
                                            schoolId,
                                            classId: item.id,
                                        }
                                    })}>
                                        <TableData>{item.name}</TableData>
                                        <TableData>{item.grade}</TableData>
                                        <TableData>{item.shift}</TableData>
                                        <TableData useRNView>
                                            <ActionsMenu
                                                actions={createClassRowActions({
                                                    onEdit: () =>
                                                        router.push({
                                                            pathname:
                                                                "/schools/[schoolId]/classes/[classId]",
                                                            params: {
                                                                schoolId,
                                                                classId: item.id,
                                                            },
                                                        }),
                                                    onDelete: () => {
                                                        clearError();
                                                        setClassToDelete(item);
                                                    },
                                                })}
                                            />
                                        </TableData>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <Div className="flex-row items-center justify-between">

                                <TableCaption>
                                    {total}{" "}
                                    {total === 1
                                        ? "turma encontrada"
                                        : "turmas encontradas"}
                                </TableCaption>
                            </Div>
                        </Table>
                    </ScrollView>

                    {total === 0 ? (
                        <Alert className="mt-4">
                            <AlertIcon as={InfoIcon} />
                            <AlertText>
                                Nenhuma turma encontrada para esse filtro.
                            </AlertText>
                        </Alert>
                    ) : (
                        <TablePagination
                            page={page}
                            pageCount={pageCount}
                            onPageChange={setPage}
                        />
                    )}
                </VStack>
            ) : null}

            <ConfirmDialog
                visible={classToDelete !== null}
                title="Excluir turma?"
                description={
                    classToDelete
                        ? `A turma "${classToDelete.name}" será removida.`
                        : ""
                }
                error={classToDelete ? error : null}
                loading={deleting}
                onCancel={() => setClassToDelete(null)}
                onConfirm={confirmDelete}
            />
        </ScrollView>
    );
}
