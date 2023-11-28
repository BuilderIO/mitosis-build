import * as CSS from 'csstype';
import { MitosisComponent } from '../../types/mitosis-component';
import { MitosisNode } from '../../types/mitosis-node';
export declare const nodeHasCss: (node: MitosisNode) => boolean;
export declare const nodeHasStyle: (node: MitosisNode) => boolean;
export declare const hasCss: (component: MitosisComponent) => boolean;
export declare const hasStyle: (component: MitosisComponent) => boolean;
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
export type StyleMap = {
    [className: string]: CSS.Properties | StyleMap;
};
export declare const getNestedSelectors: (map: StyleMap) => import("lodash").Dictionary<CSS.Properties<0 | (string & {}), string & {}> | StyleMap>;
export declare const getStylesOnly: (map: StyleMap) => import("lodash").Dictionary<CSS.Properties<0 | (string & {}), string & {}> | StyleMap>;
/**
 * { 'my-class': { display: 'block', '&.foo': { display: 'none' } }}
 */
export type ClassStyleMap = {
    [key: string]: StyleMap;
};
export declare const parseCssObject: (css: string) => any;
export declare const styleMapToCss: (map: StyleMap) => string;
