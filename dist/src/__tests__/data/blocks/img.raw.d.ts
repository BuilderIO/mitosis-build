import '@builder.io/mitosis';
export interface ImgProps {
    attributes?: any;
    imgSrc?: string;
    altText?: string;
    backgroundSize?: 'cover' | 'contain';
    backgroundPosition?: 'center' | 'top' | 'left' | 'right' | 'bottom' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
}
export default function ImgComponent(props: ImgProps): JSX.Element;
