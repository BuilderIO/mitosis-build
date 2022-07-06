import { BuilderElement } from '@builder.io/sdk';
export interface FormProps {
    attributes?: any;
    name?: string;
    action?: string;
    validate?: boolean;
    method?: string;
    builderBlock?: BuilderElement;
    sendSubmissionsTo?: string;
    sendSubmissionsToEmail?: string;
    sendWithJs?: boolean;
    contentType?: string;
    customHeaders?: {
        [key: string]: string;
    };
    successUrl?: string;
    previewState?: FormState;
    successMessage?: BuilderElement[];
    errorMessage?: BuilderElement[];
    sendingMessage?: BuilderElement[];
    resetFormOnSubmit?: boolean;
    errorMessagePath?: string;
}
export declare type FormState = 'unsubmitted' | 'sending' | 'success' | 'error';
export default function FormComponent(props: FormProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
