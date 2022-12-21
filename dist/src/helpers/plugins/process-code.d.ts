import { Plugin } from '../../types/plugins';
declare type CodeType = 'hooks' | 'hooks-deps' | 'bindings' | 'properties' | 'state';
declare type CodeProcessor = (codeType: CodeType) => (code: string) => string;
/**
 * Given a `codeProcessor` function, processes all code expressions within a Mitosis component.
 */
export declare const CODE_PROCESSOR_PLUGIN: (codeProcessor: CodeProcessor) => Plugin;
export {};
