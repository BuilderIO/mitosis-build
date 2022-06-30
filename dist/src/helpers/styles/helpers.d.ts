/// <reference types="lodash" />
import * as CSS from 'csstype';
import { MitosisNode } from '../../types/mitosis-node';
import { MitosisComponent } from '../../types/mitosis-component';
export declare const nodeHasStyles: (node: MitosisNode) => boolean;
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
export declare type StyleMap = {
    [className: string]: CSS.Properties | StyleMap;
};
export declare const getNestedSelectors: (map: StyleMap) => import("lodash").Dictionary<CSS.Properties<0 | (string & {}), string & {}> | StyleMap>;
export declare const getStylesOnly: (map: StyleMap) => import("lodash").Dictionary<CSS.Properties<0 | (string & {}), string & {}> | StyleMap>;
/**
 * { 'my-class': { display: 'block', '&.foo': { display: 'none' } }}
 */
export declare type ClassStyleMap = {
    [key: string]: StyleMap;
};
export declare const parseCssObject: (css: string) => any;
export declare const styleMapToCss: (map: StyleMap) => string;
