export interface ImageProps {
    class?: string;
    image: string;
    sizes?: string;
    lazy?: boolean;
    height?: number;
    width?: number;
    altText?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    srcset?: string;
    aspectRatio?: number;
    children?: any;
}
export default function Image(props: ImageProps): JSX.Element;
