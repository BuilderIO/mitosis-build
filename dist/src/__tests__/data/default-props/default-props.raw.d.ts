export interface ButtonProps {
    attributes?: any;
    text?: string;
    link?: string;
    openLinkInNewTab?: boolean;
}
declare function Button(props: ButtonProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
declare namespace Button {
    var defaultProps: {
        text: string;
        link: boolean;
        openLinkInNewTab: boolean;
    };
}
export default Button;
