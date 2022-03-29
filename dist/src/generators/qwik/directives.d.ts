import { MitosisNode } from '../../types/mitosis-node';
export declare const DIRECTIVES: Record<string, string | ((node: MitosisNode, blockFn: () => void) => void)>;
export declare function Image(props: {
    href?: string;
    image?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    sizes?: string;
    altText?: string;
    fitContent?: boolean;
    aspectRatio?: number;
    lazy?: boolean;
    class?: string;
    children?: any[];
}): any;
export declare function __passThroughProps__(dstProps: Record<string, any>, srcProps: Record<string, any>): Record<string, any>;
export declare function CoreButton(props: {
    text?: string;
    link?: string;
    class?: string;
    openInNewTab?: string;
    tagName$: string;
}): any;
