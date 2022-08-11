export declare type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export declare type OmitObj<T, U> = U extends T ? Omit<T, keyof U> : never;
export declare type Dictionary<T> = {
    [key: string]: T;
};
