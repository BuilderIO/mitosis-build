import { MitosisComponent } from '../../../types/mitosis-component';
import { MitosisNode } from '../../../types/mitosis-node';
export type CodeType = 'hooks' | 'hooks-deps' | 'bindings' | 'properties' | 'state' | 'types' | 'context-set' | 'dynamic-jsx-elements';
declare function codeProcessor(codeType: CodeType, json: MitosisComponent, node?: MitosisNode): (code: string, hookType: string) => string | (() => void);
export type CodeProcessor = typeof codeProcessor;
export {};
