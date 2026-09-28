import {
    http,
    HttpResponse,
} from "msw";

import { API_URL } from "@/constants/api";
import type { Class, CreateClassInputDto, UpdateClassInputDto } from "@/domain/class/class";
import { createClass } from "@/domain/class/class.factory";

let classes: Class[] = [
    createClass(
        {
            name: "6º Ano A",
            grade: "6º Ano",
            shift: "Matutino",
        },
        "1",
        "1"
    ),
    createClass(
        {
            name: "6º Ano B",
            grade: "6º Ano",
            shift: "Vespertino",
        },
        "1",
        "2"
    ),
    createClass(
        {
            name: "7º Ano A",
            grade: "7º Ano",
            shift: "Matutino",
        },
        "2",
        "3"
    ),
];

export function removeClassesBySchoolId(schoolId: string) {
    classes = classes.filter((item) => item.schoolId !== schoolId);
}

export const classHandlers = [
    http.get(`${API_URL}/schools/:schoolId/classes`, ({ params }) => {
        const schoolClasses = classes.filter(
            (item) => item.schoolId === params.schoolId
        );

        return HttpResponse.json(schoolClasses);
    }),

    http.post(`${API_URL}/schools/:schoolId/classes`, async ({ params, request }) => {
        const body = (await request.json()) as CreateClassInputDto;
        const newClass = createClass(body, params.schoolId as string);

        classes.push(newClass);

        return HttpResponse.json(newClass, {
            status: 201,
        });
    }),

    http.get(`${API_URL}/schools/:schoolId/classes/:classId`, ({ params }) => {
        const found = classes.find(
            (item) => item.id === params.classId && item.schoolId === params.schoolId
        );

        if (!found) {
            return HttpResponse.json(
                {
                    message: "Turma não encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        return HttpResponse.json(found);
    }),

    http.put(`${API_URL}/schools/:schoolId/classes/:classId`, async ({ params, request }) => {
        const body = (await request.json()) as UpdateClassInputDto;

        const index = classes.findIndex(
            (item) => item.id === params.classId && item.schoolId === params.schoolId
        );

        if (index < 0) {
            return HttpResponse.json(
                {
                    message: "Turma não encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        const updatedClass: Class = {
            ...classes[index],
            ...body,
            id: classes[index].id,
            schoolId: classes[index].schoolId,
        };

        classes[index] = updatedClass;

        return HttpResponse.json(updatedClass);
    }),

    http.delete(`${API_URL}/schools/:schoolId/classes/:classId`, ({ params }) => {
        const index = classes.findIndex(
            (item) => item.id === params.classId && item.schoolId === params.schoolId
        );

        if (index < 0) {
            return HttpResponse.json(
                {
                    message: "Turma não encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        classes.splice(index, 1);

        return new HttpResponse(null, {
            status: 204,
        });
    }),
];