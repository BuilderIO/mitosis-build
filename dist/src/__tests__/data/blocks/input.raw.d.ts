import '@builder.io/mitosis';
export interface FormInputProps {
    type?: string;
    attributes?: any;
    name?: string;
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
}
export default function FormInputComponent(props: FormInputProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
