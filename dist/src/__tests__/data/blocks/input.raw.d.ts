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
export default function FormInputComponent(props: FormInputProps): JSX.Element;
