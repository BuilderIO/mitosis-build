declare type Person = {
    name: string;
    age?: number;
};
export default function MyBasicComponent(props: Person): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
export {};
