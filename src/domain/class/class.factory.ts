import type { Class, CreateClassInputDto } from "@/domain/class/class";

export function createClass(
    input: CreateClassInputDto,
    schoolId: string,
    id: string = crypto.randomUUID()
): Class {
    return {
        id,
        name: input.name,
        grade: input.grade,
        shift: input.shift,
        schoolId,
    };
}
