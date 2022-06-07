import { BaseTranspilerOptions, Transpiler } from '../types/config';
import { MitosisNode } from '../types/mitosis-node';
export interface ToReactOptions extends BaseTranspilerOptions {
    stylesType?: 'emotion' | 'styled-components' | 'styled-jsx' | 'react-native';
    stateType?: 'useState' | 'mobx' | 'valtio' | 'solid' | 'builder';
    format?: 'lite' | 'safe';
    type?: 'dom' | 'native';
    forwardRef?: string;
    experimental?: any;
}
export declare const blockToReact: (json: MitosisNode, options: ToReactOptions, parentSlots?: any[]) => string;
export declare const componentToReact: (reactOptions?: ToReactOptions) => Transpiler;
