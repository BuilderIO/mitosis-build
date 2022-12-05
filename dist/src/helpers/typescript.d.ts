export declare type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export declare type OmitObj<T, U> = T extends U ? Omit<T, keyof U> : never;
export declare type Dictionary<T> = {
    [key: string]: T;
};
export declare const objectHasKey: <T>(object: T, key: PropertyKey) => key is keyof T;
