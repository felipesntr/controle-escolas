import { create } from "zustand";

import type {
    Class,
    CreateClassInputDto,
    UpdateClassInputDto,
} from "@/features/classes/domain/class";

import {
    createClass,
    deleteClass,
    getClass,
    getClasses,
    updateClass,
} from "@/features/classes/services/class.service";
import { waitForListLoading } from "@/shared/utils/minimum-delay";

type ClassState = {
    classes: Class[];
    selectedClass: Class | null;

    loading: boolean;
    loadingClass: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;

    error: string | null;

    fetchClasses: (
        schoolId: string
    ) => Promise<void>;

    addClass: (
        schoolId: string,
        data: CreateClassInputDto
    ) => Promise<Class>;

    fetchClass: (
        schoolId: string,
        classId: string
    ) => Promise<void>;

    editClass: (
        schoolId: string,
        classId: string,
        data: UpdateClassInputDto
    ) => Promise<Class>;

    removeClass: (
        schoolId: string,
        classId: string
    ) => Promise<void>;

    clearError: () => void;
};

export const useClassStore = create<ClassState>(
    (set) => ({
        classes: [],
        selectedClass: null,

        loading: false,
        loadingClass: false,
        creating: false,
        updating: false,
        deleting: false,

        error: null,

        fetchClasses: async (schoolId) => {
            const startedAt = Date.now();

            try {
                set({
                    loading: true,
                    error: null,
                });

                const classes = await getClasses(schoolId);
                await waitForListLoading(startedAt);

                set({
                    classes,
                    loading: false,
                });
            } catch (error) {
                await waitForListLoading(startedAt);
                set({
                    loading: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao carregar turmas.",
                });
            }
        },

        addClass: async (schoolId, data) => {
            try {
                set({
                    creating: true,
                    error: null,
                });

                const newClass = await createClass(
                    schoolId,
                    data
                );

                set((state) => ({
                    classes: [
                        ...state.classes,
                        newClass,
                    ],
                    creating: false,
                }));

                return newClass;
            } catch (error) {
                set({
                    creating: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao criar turma.",
                });

                throw error;
            }
        },

        fetchClass: async (schoolId, classId) => {
            try {
                set({
                    loadingClass: true,
                    error: null,
                });

                const selectedClass = await getClass(
                    schoolId,
                    classId
                );

                set({
                    selectedClass,
                    loadingClass: false,
                });
            } catch (error) {
                set({
                    loadingClass: false,
                    selectedClass: null,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao carregar turma.",
                });
            }
        },

        editClass: async (schoolId, classId, data) => {
            try {
                set({
                    updating: true,
                    error: null,
                });

                const updatedClass = await updateClass(
                    schoolId,
                    classId,
                    data
                );

                set((state) => ({
                    classes: state.classes.map((item) =>
                        item.id === updatedClass.id
                            ? updatedClass
                            : item
                    ),
                    selectedClass: updatedClass,
                    updating: false,
                }));

                return updatedClass;
            } catch (error) {
                set({
                    updating: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao atualizar turma.",
                });

                throw error;
            }
        },

        removeClass: async (schoolId, classId) => {
            try {
                set({
                    deleting: true,
                    error: null,
                });

                await deleteClass(schoolId, classId);

                set((state) => ({
                    classes: state.classes.filter(
                        (item) => item.id !== classId
                    ),
                    selectedClass:
                        state.selectedClass?.id === classId
                            ? null
                            : state.selectedClass,
                    deleting: false,
                }));
            } catch (error) {
                set({
                    deleting: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Erro ao excluir turma.",
                });

                throw error;
            }
        },

        clearError: () => {
            set({
                error: null,
            });
        },
    })
);