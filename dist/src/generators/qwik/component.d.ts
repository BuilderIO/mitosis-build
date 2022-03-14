import { MitosisComponent } from '../../types/mitosis-component';
import { File, SrcBuilder } from './src-generator';
export declare type QwikOptions = {
    qwikLib?: string;
    qrlPrefix?: string;
    output?: 'ts' | 'cjs' | 'mjs';
    jsx?: boolean;
    minify?: boolean;
};
export interface FileSet {
    high: File;
    med: File;
    low: File;
}
export declare function createFileSet(options?: QwikOptions): FileSet;
export declare function addComponent(fileSet: FileSet, component: MitosisComponent, opts?: {
    isRoot?: boolean;
    shareStyles?: boolean;
}): void;
export declare function renderUseLexicalScope(file: File): (this: SrcBuilder) => SrcBuilder;
export declare function addCommonStyles(fileSet: FileSet): void;
