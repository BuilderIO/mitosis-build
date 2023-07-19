import { MitosisComponent } from '../../../types/mitosis-component';
import { Plugin } from '../../../types/plugins';
import { CodeProcessor } from './types';
export declare const createCodeProcessorPlugin: (codeProcessor: CodeProcessor, { processProperties }?: {
    processProperties?: boolean | undefined;
}) => (json: MitosisComponent) => void;
/**
 * Given a `codeProcessor` function, processes all code expressions within a Mitosis component.
 */
export declare const CODE_PROCESSOR_PLUGIN: (a_0: (codeType: import("./types").CodeType, json: MitosisComponent, node?: import("../../..").MitosisNode | undefined) => (code: string, hookType: string) => string | (() => void), a_1?: {
    processProperties?: boolean | undefined;
} | undefined) => Plugin;
