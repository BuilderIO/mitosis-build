import { Plugin } from '../../types/plugins';
import { MitosisComponent } from '../../types/mitosis-component';
declare type CodeType = 'hooks' | 'hooks-deps' | 'bindings' | 'properties' | 'state' | 'dynamic-jsx-elements';
declare function codeProcessor(codeType: CodeType, json: MitosisComponent): (code: string, hookType: string) => string;
declare type CodeProcessor = typeof codeProcessor;
/**
 * Given a `codeProcessor` function, processes all code expressions within a Mitosis component.
 */
export declare const CODE_PROCESSOR_PLUGIN: (codeProcessor: CodeProcessor) => Plugin;
export {};
