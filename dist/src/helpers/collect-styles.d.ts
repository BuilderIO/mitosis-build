import * as CSS from 'csstype';
import { MitosisComponent } from '../types/mitosis-component';
export declare const hasStyles: (component: MitosisComponent) => boolean;
/**
 * e.g.:
 * {
 *  display: 'none',
 *  '@media (max-width: 500px)': {
 *    '& .sub-class': {
 *      display: 'block'
 *    }
 *  }
 * }
 */
declare type StyleMap = {
    [className: string]: CSS.Properties | StyleMap;
};
/**
 * { 'my-class': { display: 'block', '&.foo': { display: 'none' } }}
 */
export declare type ClassStyleMap = {
    [key: string]: StyleMap;
};
declare type CollectStyleOptions = {
    classProperty?: 'class' | 'className';
    prefix?: string;
};
export declare const collectStyledComponents: (json: MitosisComponent) => string;
export declare const collectCss: (json: MitosisComponent, options?: CollectStyleOptions) => string;
export {};
