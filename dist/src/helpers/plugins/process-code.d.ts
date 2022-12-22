import { Plugin } from '../../types/plugins';
import { MitosisComponent } from '../../types/mitosis-component';
declare type CodeType = 'hooks' | 'hooks-deps' | 'bindings' | 'properties' | 'state';
declare function codeProcessor(codeType: CodeType): (code: string, hookType?: keyof MitosisComponent['hooks']) => string;
declare type CodeProcessor = typeof codeProcessor;
/**
 * Given a `codeProcessor` function, processes all code expressions within a Mitosis component.
 */
export declare const CODE_PROCESSOR_PLUGIN: (codeProcessor: CodeProcessor) => Plugin;
export {};
