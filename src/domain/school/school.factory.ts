import type { CreateSchoolInputDto, School } from "@/domain/school/school";

export function createSchool(
    input: CreateSchoolInputDto,
    id: string = crypto.randomUUID()
): School {
    return {
        id,
        name: input.name,
        address: input.address,
        city: input.city,
    };
}
