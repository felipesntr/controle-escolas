export const CLASS_GRADES = [
    "1º Ano",
    "2º Ano",
    "3º Ano",
    "4º Ano",
    "5º Ano",
    "6º Ano",
    "7º Ano",
    "8º Ano",
    "9º Ano",
];

export const CLASS_SHIFTS = ["Matutino", "Vespertino", "Noturno"];

export function withCurrentOption(options: string[], current: string) {
    if (!current || options.includes(current)) {
        return options;
    }

    return [current, ...options];
}
