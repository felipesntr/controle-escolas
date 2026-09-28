import type {
    CreateSchoolInputDto,
    School,
    UpdateSchoolInputDto,
} from "@/domain/school/school";

import { API_URL } from "@/constants/api";

export async function getSchools(): Promise<School[]> {
    const response = await fetch(`${API_URL}/schools`);

    if (!response.ok) {
        throw new Error("Não foi possível carregar as escolas.");
    }

    return response.json();
}

export async function getSchool(schoolId: string): Promise<School> {
    const response = await fetch(`${API_URL}/schools/${schoolId}`);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a escola.");
    }

    return response.json();
}

export async function createSchool(data: CreateSchoolInputDto): Promise<School> {
    const response = await fetch(`${API_URL}/schools`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Não foi possível criar a escola.");
    }

    return response.json();
}

export async function updateSchool(
    schoolId: string,
    data: UpdateSchoolInputDto
): Promise<School> {
    const response = await fetch(`${API_URL}/schools/${schoolId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Não foi possível atualizar a escola.");
    }

    return response.json();
}

export async function deleteSchool(schoolId: string): Promise<void> {
    const response = await fetch(`${API_URL}/schools/${schoolId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Não foi possível excluir a escola.");
    }
}