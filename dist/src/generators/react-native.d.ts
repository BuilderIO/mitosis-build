import { ClassStyleMap } from '../helpers/collect-styles';
import { MitosisComponent } from '../types/mitosis-component';
import { BaseTranspilerOptions, Transpiler } from '../types/transpiler';
export interface ToReactNativeOptions extends BaseTranspilerOptions {
    stylesType?: 'emotion' | 'react-native';
    stateType?: 'useState' | 'mobx' | 'valtio' | 'solid' | 'builder';
}
export declare const collectReactNativeStyles: (json: MitosisComponent) => ClassStyleMap;
export declare const componentToReactNative: (options?: ToReactNativeOptions) => Transpiler;
