export declare const replaceIdentifiers: ({ code, from, to, }: {
    code: string;
    from: string | string[];
    to: string | ((identifier: string) => string);
}) => string;
