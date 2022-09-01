export declare type Nullable<X> = X | null | undefined;
export declare const checkIsDefined: <T>(value: Nullable<T>) => value is NonNullable<T>;
