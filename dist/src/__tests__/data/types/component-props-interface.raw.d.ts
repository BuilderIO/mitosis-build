interface Person {
    name: string;
    age?: number;
}
export default function MyBasicComponent(props: Person | never): JSX.Element;
export {};
