import { BFSRequire } from 'browserfs';

type CommandReturnData = {
    newRoute: string;
    outputData: string[];
};
const MODULE_NAMES = Object.freeze(['fs', 'buffer', 'path', 'process', 'bfs_utils']);
const HELP_MESSAGES = ['fs - file system', 'buffer - buffer', 'path - change path', 'process - process'];
export async function executeCommand(currentRoute: string, command: string): Promise<CommandReturnData> {
    const splits = command.split(' ').map((str) => str.trim());
    const baseCommand = splits.at(0);
    const returnData: CommandReturnData = {
        newRoute: currentRoute,
        outputData: [],
    };

    if (baseCommand === 'help') return { ...returnData, outputData: HELP_MESSAGES };

    console.log(currentRoute);
    switch (baseCommand) {
        case 'path': {
            if (splits.at(1) === '--help') {
                //TODO add help info for path
                returnData.outputData = [];
                break;
            }
            const path = BFSRequire('path');
            break;
        }
        case 'fs': {
            const fs = BFSRequire('fs');
            // fs.mkdirSync('/hi');
            // fs.writeFileSync('hello.txt', 'Dataaa');
            const content = fs.readFileSync('hello.txt');
            // fs.chmod();
            console.log('🚀 ~ file: handleCommand.ts:31 ~ executeCommand ~ content:', content);
            break;
        }
        case 'process': {
            // BFSRequire('process').chdir();
            break;
        }
        default:
            returnData.outputData = ['Invalid base command', "Write 'help' for more information"];
    }

    return returnData;
}
