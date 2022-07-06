declare type Column = {
    content: any;
    width?: number;
};
export interface ColumnProps {
    columns?: Column[];
    space?: number;
    stackColumnsAt?: 'tablet' | 'mobile' | 'never';
    reverseColumnsWhenStacked?: boolean;
}
export default function Column(props: ColumnProps): import("@builder.io/mitosis/jsx-runtime").JSX.Element;
export {};
