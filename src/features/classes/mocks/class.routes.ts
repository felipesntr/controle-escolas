import { Response, type Request, type Server } from "miragejs";

import type { Class, CreateClassInputDto, UpdateClassInputDto } from "@/features/classes/domain/class";
import { createClass } from "@/features/classes/domain/class.factory";

const classSeeds = [
    { grade: "1º Ano", section: "A", shift: "Matutino" },
    { grade: "2º Ano", section: "A", shift: "Vespertino" },
    { grade: "3º Ano", section: "A", shift: "Matutino" },
    { grade: "4º Ano", section: "A", shift: "Vespertino" },
    { grade: "5º Ano", section: "A", shift: "Matutino" },
    { grade: "6º Ano", section: "A", shift: "Vespertino" },
    { grade: "7º Ano", section: "A", shift: "Matutino" },
    { grade: "8º Ano", section: "A", shift: "Noturno" },
];

let classes: Class[] = Array.from({ length: 12 }, (_, schoolIndex) => {
    const schoolId = String(schoolIndex + 1);

    return classSeeds.map(({ grade, section, shift }, classIndex) =>
        createClass(
            {
                name: `${grade} ${section}`,
                grade,
                shift,
            },
            schoolId,
            `class-${schoolId}-${classIndex + 1}`
        )
    );
}).flat();

export function countClassesBySchoolId(schoolId: string) {
    return classes.filter((item) => item.schoolId === schoolId).length;
}

export function removeClassesBySchoolId(schoolId: string) {
    classes = classes.filter((item) => item.schoolId !== schoolId);
}

function notFound(message: string) {
    return new Response(404, {}, { message });
}

export function registerClassRoutes(server: Server) {
    server.get("/schools/:schoolId/classes", (_schema, request: Request) => {
        return classes.filter((item) => item.schoolId === request.params.schoolId);
    });

    server.post("/schools/:schoolId/classes", (_schema, request: Request) => {
        const body = JSON.parse(request.requestBody) as CreateClassInputDto;
        const newClass = createClass(body, request.params.schoolId);

        classes.push(newClass);

        return new Response(201, {}, newClass);
    });

    server.get("/schools/:schoolId/classes/:classId", (_schema, request: Request) => {
        const found = classes.find(
            (item) =>
                item.id === request.params.classId &&
                item.schoolId === request.params.schoolId
        );

        if (!found) {
            return notFound("Turma não encontrada.");
        }

        return found;
    });

    server.put("/schools/:schoolId/classes/:classId", (_schema, request: Request) => {
        const body = JSON.parse(request.requestBody) as UpdateClassInputDto;
        const index = classes.findIndex(
            (item) =>
                item.id === request.params.classId &&
                item.schoolId === request.params.schoolId
        );

        if (index < 0) {
            return notFound("Turma não encontrada.");
        }

        const updatedClass: Class = {
            ...classes[index],
            ...body,
            id: classes[index].id,
            schoolId: classes[index].schoolId,
        };

        classes[index] = updatedClass;

        return updatedClass;
    });

    server.delete("/schools/:schoolId/classes/:classId", (_schema, request: Request) => {
        const index = classes.findIndex(
            (item) =>
                item.id === request.params.classId &&
                item.schoolId === request.params.schoolId
        );

        if (index < 0) {
            return notFound("Turma não encontrada.");
        }

        classes.splice(index, 1);

        return new Response(204);
    });
}
