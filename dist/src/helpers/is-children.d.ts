import { MitosisNode } from '../types/mitosis-node';
export declare const getTextValue: (node: MitosisNode) => string;
export default function isChildren({ node, extraMatches, }: {
    node: MitosisNode;
    extraMatches?: string[];
}): boolean;
