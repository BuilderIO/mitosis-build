export interface FormSelectProps {
    options?: {
        name?: string;
        value: string;
    }[];
    attributes?: any;
    name?: string;
    value?: string;
    defaultValue?: string;
}
export default function SelectComponent(props: FormSelectProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
