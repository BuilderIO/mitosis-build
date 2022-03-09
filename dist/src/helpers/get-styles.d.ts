import { MitosisNode } from '../types/mitosis-node';
import { MitosisStyles } from '../types/mitosis-styles';
export declare const getStyles: (json: MitosisNode) => MitosisStyles | null;
export declare const setStyles: (json: MitosisNode, styles: MitosisStyles | null) => void;
