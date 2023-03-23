import { ClassStyleMap } from '../../helpers/styles/helpers';
import { MitosisComponent } from '../../types/mitosis-component';
import { BaseTranspilerOptions, TranspilerGenerator } from '../../types/transpiler';
export interface ToReactNativeOptions extends BaseTranspilerOptions {
    stylesType: 'emotion' | 'react-native';
    stateType: 'useState' | 'mobx' | 'valtio' | 'solid' | 'builder';
}
export declare const collectReactNativeStyles: (json: MitosisComponent) => ClassStyleMap;
export declare const componentToReactNative: TranspilerGenerator<Partial<ToReactNativeOptions>>;
