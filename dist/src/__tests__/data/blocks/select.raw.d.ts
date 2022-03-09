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
export default function SelectComponent(props: FormSelectProps): JSX.Element;
