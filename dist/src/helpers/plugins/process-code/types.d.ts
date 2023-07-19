import { MitosisComponent } from '../../../types/mitosis-component';
import { MitosisNode } from '../../../types/mitosis-node';
export declare type CodeType = 'hooks' | 'hooks-deps' | 'bindings' | 'properties' | 'state' | 'types' | 'context-set' | 'dynamic-jsx-elements';
declare function codeProcessor(codeType: CodeType, json: MitosisComponent, node?: MitosisNode): (code: string, hookType: string) => string | (() => void);
export declare type CodeProcessor = typeof codeProcessor;
export {};
