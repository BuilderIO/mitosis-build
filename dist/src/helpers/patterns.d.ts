export declare const GETTER: RegExp;
export declare const SETTER: RegExp;
export declare const checkIsGetter: (code: string) => RegExpMatchArray | null;
export declare const stripGetter: (str: string) => string;
export declare const replaceGetterWithFunction: (str: string) => string;
export declare const replaceFunctionWithGetter: (str: string) => string;
export declare const prefixWithFunction: (str: string) => string;
