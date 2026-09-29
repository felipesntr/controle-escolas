import { create } from "zustand";

import type {
    CreateSchoolInputDto,
    School,
    UpdateSchoolInputDto,
} from "@/features/schools/domain/school";

import {
    createSchool,
    deleteSchool,
    getSchool,
    getSchools,
    updateSchool,
} from "@/shared/services/school.service";
import { useClassStore } from "@/shared/stores/class.store";
import { waitForListLoading } from "@/shared/utils/minimum-delay";

type SchoolState = {
    schools: School[];

    selectedSchool: School | null;

    loading: boolean;
    loadingSchool: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;

    error: string | null;

    fetchSchools: () => Promise<void>;

    fetchSchool: (schoolId: string) => Promise<void>;

    addSchool: (
        data: CreateSchoolInputDto
    ) => Promise<School>;

    editSchool: (
        schoolId: string,
        data: UpdateSchoolInputDto
    ) => Promise<School>;

    removeSchool: (schoolId: string) => Promise<void>;

    clearSelectedSchool: () => void;

    clearError: () => void;
};

export const useSchoolStore = create<SchoolState>(
    (set) => ({
        schools: [],

        selectedSchool: null,

        loading: false,
        loadingSchool: false,
        creating: false,
        updating: false,
        deleting: false,

        error: null,

        fetchSchools: async () => {
            const startedAt = Date.now();

            try {
                set({
                    loading: true,
                    error: null,
                });

                const schools = await getSchools();
                await waitForListLoading(startedAt);

                set({
                    schools,
                    loading: false,
                });
            } catch (error) {
                await waitForListLoading(startedAt);
                set({
                    loading: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao carregar escolas.",
                });
            }
        },

        fetchSchool: async (schoolId) => {
            try {
                set({
                    loadingSchool: true,
                    error: null,
                });

                const school = await getSchool(schoolId);

                set({
                    selectedSchool: school,
                    loadingSchool: false,
                });
            } catch (error) {
                set({
                    loadingSchool: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao carregar escola.",
                });
            }
        },

        addSchool: async (data) => {
            try {
                set({
                    creating: true,
                    error: null,
                });

                const school = await createSchool(data);

                set((state) => ({
                    schools: [...state.schools, { ...school, classCount: 0 }],
                    creating: false,
                }));

                return school;
            } catch (error) {
                set({
                    creating: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao criar escola.",
                });

                throw error;
            }
        },

        editSchool: async (schoolId, data) => {
            try {
                set({
                    updating: true,
                    error: null,
                });

                const school = await updateSchool(
                    schoolId,
                    data
                );

                set((state) => ({
                    schools: state.schools.map((item) =>
                        item.id === school.id
                            ? { ...school, classCount: item.classCount ?? 0 }
                            : item
                    ),
                    selectedSchool:
                        state.selectedSchool?.id === school.id
                            ? school
                            : state.selectedSchool,
                    updating: false,
                }));

                return school;
            } catch (error) {
                set({
                    updating: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao atualizar escola.",
                });

                throw error;
            }
        },

        removeSchool: async (schoolId) => {
            try {
                set({
                    deleting: true,
                    error: null,
                });

                await deleteSchool(schoolId);

                set((state) => ({
                    schools: state.schools.filter(
                        (item) => item.id !== schoolId
                    ),
                    selectedSchool:
                        state.selectedSchool?.id === schoolId
                            ? null
                            : state.selectedSchool,
                    deleting: false,
                }));

                useClassStore.setState((state) => ({
                    classes: state.classes.filter(
                        (item) => item.schoolId !== schoolId
                    ),
                    selectedClass:
                        state.selectedClass?.schoolId === schoolId
                            ? null
                            : state.selectedClass,
                }));
            } catch (error) {
                set({
                    deleting: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao excluir escola.",
                });

                throw error;
            }
        },

        clearSelectedSchool: () => {
            set({
                selectedSchool: null,
            });
        },

        clearError: () => {
            set({
                error: null,
            });
        },
    })
);