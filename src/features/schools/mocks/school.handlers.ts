import {
    http,
    HttpResponse,
} from "msw";

import type { CreateSchoolInputDto, School, UpdateSchoolInputDto } from "@/features/schools/domain/school";
import { createSchool } from "@/features/schools/domain/school.factory";
import {
    countClassesBySchoolId,
    removeClassesBySchoolId,
} from "@/features/classes/mocks/class.handlers";
import { API_URL } from "@/shared/constants/api";

let schools: School[] = [
    createSchool(
        {
            name: "Escola Municipal João Silva",
            address: "Rua das Flores, 100",
            city: "Aracaju",
        },
        "1"
    ),
    createSchool(
        {
            name: "Escola Municipal Maria Santos",
            address: "Av. Brasil, 500",
            city: "São Cristóvão",
        },
        "2"
    ),
];

export const schoolHandlers = [
    http.get(`${API_URL}/schools`, () => {
        return HttpResponse.json(
            schools.map((school) => ({
                ...school,
                classCount: countClassesBySchoolId(school.id),
            }))
        );
    }),

    http.get(`${API_URL}/schools/:schoolId`, ({ params }) => {
        const school = schools.find((item) => item.id === params.schoolId);

        if (!school) {
            return HttpResponse.json(
                {
                    message: "Escola não encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        return HttpResponse.json(school);
    }),

    http.post(`${API_URL}/schools`, async ({ request }) => {
        const body = (await request.json()) as CreateSchoolInputDto;
        const school = createSchool(body);

        schools.push(school);

        return HttpResponse.json(school, {
            status: 201,
        });
    }),

    http.put(`${API_URL}/schools/:schoolId`, async ({ params, request }) => {
        const body = (await request.json()) as UpdateSchoolInputDto;

        const index = schools.findIndex((item) => item.id === params.schoolId);

        if (index < 0) {
            return HttpResponse.json(
                {
                    message: "Escola não encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        const school: School = {
            ...schools[index],
            ...body,
            id: schools[index].id,
        };

        schools[index] = school;

        return HttpResponse.json(school);
    }),

    http.delete(`${API_URL}/schools/:schoolId`, ({ params }) => {
        const index = schools.findIndex((item) => item.id === params.schoolId);

        if (index < 0) {
            return HttpResponse.json(
                {
                    message: "Escola não encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        const schoolId = schools[index].id;

        schools.splice(index, 1);
        removeClassesBySchoolId(schoolId);

        return new HttpResponse(null, {
            status: 204,
        });
    }),
];