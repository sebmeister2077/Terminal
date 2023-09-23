type ReturnType = {
    newRoute: string;
    outputData: string[];
};
export async function executeCommand(command: string): Promise<ReturnType> {
    return {
        newRoute: '',
        outputData: [],
    };
}
