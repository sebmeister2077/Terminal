import { BFSRequire } from 'browserfs';

type CommandReturnData = {
    newRoute: string;
    outputData: string[];
};
const MODULE_NAMES = Object.freeze(['fs', 'buffer', 'path', 'process', 'bfs_utils']);
const HELP_MESSAGES = ['fs - file system', 'buffer - buffer', 'path - change path', 'process - process'];
export async function executeCommand(currentRoute: string, command: string): Promise<CommandReturnData> {
    console.log('🚀 ~ file: handleCommand.ts:10 ~ executeCommand ~ command:', command);

    const splits = command.split(' ').map((str) => str.trim());
    const moduleName = splits.at(0);
    const returnData: CommandReturnData = {
        newRoute: currentRoute,
        outputData: [],
    };

    console.log(moduleName);
    if (moduleName === 'help') return { ...returnData, outputData: HELP_MESSAGES };
    if (!moduleName || !MODULE_NAMES.includes(moduleName))
        return { ...returnData, outputData: ['Invalid base command', "Write 'help' for more information"] };
    const mod = BFSRequire(moduleName);
    console.log(mod);
    return returnData;
}
