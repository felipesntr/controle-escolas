import { classHandlers } from "./class.handlers";
import { schoolHandlers } from "./school.handlers";

export const handlers = [
    ...schoolHandlers,
    ...classHandlers,
];