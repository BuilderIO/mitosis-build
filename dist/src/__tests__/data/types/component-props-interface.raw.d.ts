interface Person {
    name: string;
    age?: number;
}
export default function MyBasicComponent(props: Person | never): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
export {};
