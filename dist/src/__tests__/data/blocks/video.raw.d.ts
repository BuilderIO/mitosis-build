export interface VideoProps {
    attributes?: any;
    video?: string;
    autoPlay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    aspectRatio?: number;
    width?: number;
    height?: number;
    fit?: 'contain' | 'cover' | 'fill';
    position?: 'center' | 'top' | 'left' | 'right' | 'bottom' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
    posterImage?: string;
    lazyLoad?: boolean;
}
export default function Video(props: VideoProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
