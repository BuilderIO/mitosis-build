import { Project, SourceFile, Symbol } from 'ts-morph';
export declare const removeMitosisImport: (code: string) => string;
export declare const getPropsSymbol: (ast: SourceFile) => Symbol | undefined;
export declare const getContextSymbols: (ast: SourceFile) => Set<Symbol>;
export declare const createTypescriptProject: (tsConfigFilePath: string) => {
    project: Project;
};
