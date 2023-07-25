import { Project, Symbol } from 'ts-morph';
export declare const findSignals: (args: {
    project: Project;
    signalSymbol: Symbol;
    code?: string | undefined;
    filePath?: string | undefined;
}) => {
    props: Set<string>;
    state: Set<string>;
    context: Set<string>;
};
