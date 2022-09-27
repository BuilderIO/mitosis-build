declare type Props = {
    children: any;
    type: string;
};
export default function MyBasicComponent({ children: c, type }: Props): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
export {};
