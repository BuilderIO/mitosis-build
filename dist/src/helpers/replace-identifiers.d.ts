declare type ReplaceArgs = {
    code: string;
    from: string | string[];
    to: string | ((identifier: string) => string) | null;
};
export declare const replaceIdentifiers: ({ code, from, to }: ReplaceArgs) => string;
export {};
