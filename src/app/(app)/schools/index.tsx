import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { ScrollView } from "react-native";

import { ActionsMenu } from "@/components/actions-menu";
import { useFeedbackToast } from "@/components/app-toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { LoadingBlock } from "@/components/loading-block";
import { createSchoolRowActions } from "@/components/school-row-actions";
import { TablePagination } from "@/components/table-pagination";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Button, ButtonIcon } from "@/components/ui/button";
import {
    AddIcon,
    AlertCircleIcon,
    InfoIcon,
    RefreshCwIcon,
    SearchIcon,
} from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableData,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { School } from "@/domain/school/school";
import { useFetchSchools } from "@/hooks/use-fetch-schools";
import { usePagedList } from "@/hooks/use-paged-list";
import { useSchoolStore } from "@/stores/school.store";
import { Div } from "@expo/html-elements";

function matchesSchool(school: School, query: string) {
    return [school.name, school.address, school.city].some((value) =>
        value.toLowerCase().includes(query)
    );
}

export default function SchoolsPage() {
    const router = useRouter();
    const navigation = useNavigation();
    const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

    const { schools, loading, error } = useFetchSchools();
    const fetchSchools = useSchoolStore((state) => state.fetchSchools);
    const showToast = useFeedbackToast();
    const deleting = useSchoolStore((state) => state.deleting);
    const removeSchool = useSchoolStore((state) => state.removeSchool);
    const clearError = useSchoolStore((state) => state.clearError);
    const { query, setQuery, page, setPage, pageCount, pageItems, total } =
        usePagedList(schools, matchesSchool);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <Button
                        size="icon"
                        variant="ghost"
                        accessibilityLabel="Recarregar"
                        disabled={loading}
                        onPress={() => fetchSchools()}
                    >
                        <ButtonIcon as={RefreshCwIcon} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        accessibilityLabel="Nova escola"
                        onPress={() => router.push("/schools/new")}
                    >
                        <ButtonIcon as={AddIcon} />
                    </Button>
                </>
            ),
        });
    }, [navigation, router, fetchSchools, loading]);

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

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
            <Text className="text-typography-500">
                Gerencie as escolas cadastradas
            </Text>

            <Input className="mt-4">
                <InputSlot className="pl-3">
                    <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                    placeholder="Filtrar por nome, endereço ou cidade"
                    value={query}
                    onChangeText={setQuery}
                />
            </Input>

            {loading ? (
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

            {!loading ? (
                <VStack className="mt-5">
                    <ScrollView horizontal>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Endereço</TableHead>
                                    <TableHead>Cidade</TableHead>
                                    <TableHead>Turmas</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageItems.map((item) => (
                                    <TableRow key={item.id} onPress={() => router.push(`/schools/${item.id}`)}>
                                        <TableData>{item.name}</TableData>
                                        <TableData>{item.address}</TableData>
                                        <TableData>{item.city}</TableData>
                                        <TableData>{item.classCount ?? 0}</TableData>
                                        <TableData useRNView>
                                            <ActionsMenu
                                                actions={createSchoolRowActions({
                                                    onView: () =>
                                                        router.push({
                                                            pathname:
                                                                "/schools/[schoolId]",
                                                            params: {
                                                                schoolId: item.id,
                                                            },
                                                        }),
                                                    onEdit: () =>
                                                        router.push({
                                                            pathname:
                                                                "/schools/[schoolId]/edit",
                                                            params: {
                                                                schoolId: item.id,
                                                            },
                                                        }),
                                                    onDelete: () => {
                                                        clearError();
                                                        setSchoolToDelete(item);
                                                    },
                                                })}
                                            />
                                        </TableData>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <Div className="flex-row items-center justify-between">
                                <TableCaption className="items-left">
                                    {total}{" "}
                                    {total === 1
                                        ? "escola encontrada"
                                        : "escolas encontradas"}

                                </TableCaption>
                            </Div>
                        </Table>
                    </ScrollView>

                    {total === 0 ? (
                        <Alert className="mt-4">
                            <AlertIcon as={InfoIcon} />
                            <AlertText>
                                Nenhuma escola encontrada para esse filtro.
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
