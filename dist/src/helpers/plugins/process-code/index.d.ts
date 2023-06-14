import { MitosisComponent } from '../../../types/mitosis-component';
import { Plugin } from '../../../types/plugins';
import { CodeProcessor } from './types';
export declare const createCodeProcessorPlugin: (codeProcessor: CodeProcessor) => (json: MitosisComponent) => void;
/**
 * Given a `codeProcessor` function, processes all code expressions within a Mitosis component.
 */
export declare const CODE_PROCESSOR_PLUGIN: (codeProcessor: (codeType: import("./types").CodeType, json: MitosisComponent) => (code: string, hookType: string) => string) => Plugin;
