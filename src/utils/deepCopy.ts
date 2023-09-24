export const deepCopy = <T extends object>(source: T): T => {
    try {
        return structuredClone(source);
    } catch {
        return JSON.parse(JSON.stringify(source)) as T;
    }
};
