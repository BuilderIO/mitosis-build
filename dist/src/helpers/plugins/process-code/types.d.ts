import { MitosisComponent } from '../../../types/mitosis-component';
export declare type CodeType = 'hooks' | 'hooks-deps' | 'bindings' | 'properties' | 'state' | 'dynamic-jsx-elements';
declare function codeProcessor(codeType: CodeType, json: MitosisComponent): (code: string, hookType: string) => string;
export declare type CodeProcessor = typeof codeProcessor;
export {};
