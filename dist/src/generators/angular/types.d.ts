import { BaseTranspilerOptions } from '../../types/transpiler';
export declare const BUILT_IN_COMPONENTS: Set<string>;
export interface ToAngularOptions extends BaseTranspilerOptions {
    standalone?: boolean;
    preserveImports?: boolean;
    preserveFileExtensions?: boolean;
    importMapper?: Function;
    bootstrapMapper?: Function;
}
export declare const DEFAULT_ANGULAR_OPTIONS: ToAngularOptions;
export interface AngularBlockOptions {
    childComponents?: string[];
    nativeAttributes: string[];
}
