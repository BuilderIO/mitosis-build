import { MitosisNode } from '../../types/mitosis-node';
export declare const DIRECTIVES: Record<string, string | ((node: MitosisNode, blockFn: () => void) => void)>;
interface ImageProps {
    altText?: string;
    image?: string;
    href?: string;
    height?: number;
    width?: number;
    builderBlock?: any;
    attributes?: any;
    sizes?: string;
    srcsetSizes?: string;
    srcset?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    fitContent?: boolean;
    aspectRatio?: number;
    lazy?: boolean;
    class?: string;
    children?: any[];
    noWebp?: boolean;
}
export declare function Image(props: ImageProps): any;
export declare function __passThroughProps__(dstProps: Record<string, any>, srcProps: Record<string, any>): Record<string, any>;
export declare function CoreButton(props: {
    text?: string;
    link?: string;
    class?: string;
    openInNewTab?: string;
    tagName$: string;
}): any;
export {};
