import { Target } from '..';
import { SolidState } from '../generators/solid/types';
import { Dictionary } from '../helpers/typescript';
declare type Targets = typeof import('../targets').targets;
declare type TargetOptions = {
    [K in Target]?: Partial<NonNullable<Parameters<Targets[K]>[0]>>;
};
export declare type ComponentMetadata = {
    [index: string]: any;
    options?: TargetOptions;
    qwik?: {
        component?: {
            isLight?: boolean;
        };
        setUseStoreFirst?: boolean;
        hasDeepStore?: boolean;
        mutable?: string[];
        imports?: Dictionary<string>;
        replace?: Record<string, string>;
    };
    solid?: {
        state?: Dictionary<SolidState>;
    };
    rsc?: {
        componentType?: 'client' | 'server';
    };
};
export {};
