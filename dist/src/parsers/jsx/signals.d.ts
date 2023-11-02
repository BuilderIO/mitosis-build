import { Project, Symbol } from 'ts-morph';
export declare const findSignals: ({ filePath, signalSymbol, project, }: {
    project: Project;
    signalSymbol: Symbol;
    filePath: string;
}) => {
    props: Set<string>;
    state: Set<string>;
    context: Set<string>;
};
