type School = {
    id: string;
    name: string;
    address: string;
    city: string;
    classCount?: number;
}

type CreateSchoolInputDto = {
    name: string;
    address: string;
    city: string;
};

type UpdateSchoolInputDto = CreateSchoolInputDto;

export { CreateSchoolInputDto, School, UpdateSchoolInputDto };

