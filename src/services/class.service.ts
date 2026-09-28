import type {
    Class,
    CreateClassInputDto,
    UpdateClassInputDto,
} from "@/domain/class/class";

import { API_URL } from "@/constants/api";

export async function getClasses(schoolId: string): Promise<Class[]> {
    const response = await fetch(`${API_URL}/schools/${schoolId}/classes`);

    if (!response.ok) {
        throw new Error("Não foi possível carregar as turmas.");
    }

    return response.json();
}

export async function createClass(
    schoolId: string,
    data: CreateClassInputDto
): Promise<Class> {
    const response = await fetch(`${API_URL}/schools/${schoolId}/classes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Não foi possível criar a turma.");
    }

    return response.json();
}

export async function getClass(
    schoolId: string,
    classId: string
): Promise<Class> {
    const response = await fetch(
        `${API_URL}/schools/${schoolId}/classes/${classId}`
    );

    if (!response.ok) {
        throw new Error("Não foi possível carregar a turma.");
    }

    return response.json();
}

export async function updateClass(
    schoolId: string,
    classId: string,
    data: UpdateClassInputDto
): Promise<Class> {
    const response = await fetch(
        `${API_URL}/schools/${schoolId}/classes/${classId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Não foi possível atualizar a turma.");
    }

    return response.json();
}

export async function deleteClass(
    schoolId: string,
    classId: string
): Promise<void> {
    const response = await fetch(
        `${API_URL}/schools/${schoolId}/classes/${classId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Não foi possível excluir a turma.");
    }
}