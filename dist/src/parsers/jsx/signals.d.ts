import { Project } from 'ts-morph';
export declare const findSignals: ({ filePath, project }: {
    project: Project;
    filePath: string;
}) => {
    props: Set<string>;
    state: Set<string>;
    context: Set<string>;
};
