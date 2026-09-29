type Class = {
    id: string;
    name: string;
    grade: string;
    shift: string;
    schoolId: string;
}

type CreateClassInputDto = {
    name: string;
    grade: string;
    shift: string;
};

type UpdateClassInputDto = CreateClassInputDto;

export { Class, CreateClassInputDto, UpdateClassInputDto };

