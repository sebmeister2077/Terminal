import { BFSRequire } from 'browserfs';

type CommandReturnData = {
    newRoute: string;
    messages: string[];
};
// const MODULE_NAMES = Object.freeze(['fs', 'buffer', 'path', 'process', 'bfs_utils']);
const HELP_MESSAGES = ['fs - file system', 'buffer - buffer', 'path - change path', 'process - process'];
export async function executeCommand(currentRoute: string, command: string): Promise<CommandReturnData> {
    const args = command.split(' ').map((str) => str.trim());
    const baseCommand = args.at(0);
    const returnData: CommandReturnData = {
        newRoute: currentRoute,
        messages: [],
    };

    if (baseCommand === 'help') return { ...returnData, messages: HELP_MESSAGES };
    function createWithMessage(...messages: string[]) {
        return { ...returnData, messages };
    }
    const foundModule = BFSRequire(args[0]);
    if (!foundModule) return createWithMessage('Module is invalid');
    const methodName = (args.at(1) ?? '') as keyof typeof foundModule;
    const method = foundModule[((methodName as string) + 'Sync') as keyof typeof foundModule] ?? foundModule[methodName];

    switch (typeof method) {
        case 'function': {
            const process = BFSRequire('process');
            console.dir(process);
            const functionArgs = args.slice(2);
            try {
                console.dir(method);
                const result = method(...functionArgs);
                return createWithMessage(result);
            } catch (e) {
                console.dir(e);
                return createWithMessage();
            }
        }
        case 'string':
        case 'boolean':
        case 'number':
        case 'symbol':
        case 'object':
        case 'bigint':
            return createWithMessage(method);
        default: {
            const moduleKeys = Object.keys(foundModule).sort();
            return createWithMessage(
                `Bad argument: '${args.at(1)}'`,
                `Possible values are: ${moduleKeys.slice(0, 3).join(', ')} ${moduleKeys.length ? ', etc...' : ''}`,
                `To view full possible values write: ${args.at(0)} --info`,
            );
        }
    }
}
