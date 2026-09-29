import { Response, type Request, type Server } from "miragejs";

import {
    countClassesBySchoolId,
    removeClassesBySchoolId,
} from "@/features/classes/mocks/class.routes";
import type { CreateSchoolInputDto, School, UpdateSchoolInputDto } from "@/features/schools/domain/school";
import { createSchool } from "@/features/schools/domain/school.factory";

const schoolSeeds = [
    { id: "1", name: "Escola Municipal João Silva", address: "Rua das Flores, 100", city: "Aracaju" },
    { id: "2", name: "Escola Municipal Maria Santos", address: "Av. Brasil, 500", city: "São Cristóvão" },
    { id: "3", name: "Escola Municipal José de Alencar", address: "Rua do Sol, 245", city: "Nossa Senhora do Socorro" },
    { id: "4", name: "Escola Municipal Cecília Meireles", address: "Av. Central, 810", city: "Itabaiana" },
    { id: "5", name: "Escola Municipal Machado de Assis", address: "Rua das Acácias, 72", city: "Lagarto" },
    { id: "6", name: "Escola Municipal Zumbi dos Palmares", address: "Praça da Matriz, 18", city: "Estância" },
    { id: "7", name: "Escola Municipal Anita Garibaldi", address: "Rua São João, 390", city: "Barra dos Coqueiros" },
    { id: "8", name: "Escola Municipal Monteiro Lobato", address: "Av. Beira Rio, 125", city: "Propriá" },
    { id: "9", name: "Escola Municipal Carolina Maria de Jesus", address: "Rua da Liberdade, 56", city: "Tobias Barreto" },
    { id: "10", name: "Escola Municipal Paulo Freire", address: "Rua Esperança, 640", city: "Itabaianinha" },
    { id: "11", name: "Escola Municipal Darcy Ribeiro", address: "Av. dos Estudantes, 203", city: "Simão Dias" },
    { id: "12", name: "Escola Municipal Nísia Floresta", address: "Rua das Palmeiras, 91", city: "Nossa Senhora da Glória" },
];

let schools: School[] = schoolSeeds.map(({ id, ...input }) => createSchool(input, id));

function notFound(message: string) {
    return new Response(404, {}, { message });
}

export function registerSchoolRoutes(server: Server) {
    server.get("/schools", () => {
        return schools.map((school) => ({
            ...school,
            classCount: countClassesBySchoolId(school.id),
        }));
    });

    server.get("/schools/:schoolId", (_schema, request: Request) => {
        const school = schools.find((item) => item.id === request.params.schoolId);

        if (!school) {
            return notFound("Escola não encontrada.");
        }

        return school;
    });

    server.post("/schools", (_schema, request: Request) => {
        const body = JSON.parse(request.requestBody) as CreateSchoolInputDto;
        const school = createSchool(body);

        schools.push(school);

        return new Response(201, {}, school);
    });

    server.put("/schools/:schoolId", (_schema, request: Request) => {
        const body = JSON.parse(request.requestBody) as UpdateSchoolInputDto;
        const index = schools.findIndex((item) => item.id === request.params.schoolId);

        if (index < 0) {
            return notFound("Escola não encontrada.");
        }

        const school: School = {
            ...schools[index],
            ...body,
            id: schools[index].id,
        };

        schools[index] = school;

        return school;
    });

    server.delete("/schools/:schoolId", (_schema, request: Request) => {
        const index = schools.findIndex((item) => item.id === request.params.schoolId);

        if (index < 0) {
            return notFound("Escola não encontrada.");
        }

        const schoolId = schools[index].id;

        schools.splice(index, 1);
        removeClassesBySchoolId(schoolId);

        return new Response(204);
    });
}
