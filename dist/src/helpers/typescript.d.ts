export declare type Overwrite<T, U> = keyof U extends keyof T ? Pick<T, Exclude<keyof T, keyof U>> & U : never;
export declare type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
export declare type OmitObj<T, U> = T extends U ? Omit<T, keyof U> : never;
export declare type Dictionary<T> = {
    [key: string]: T;
};
export declare const objectHasKey: <T>(object: T, key: PropertyKey) => key is keyof T;
