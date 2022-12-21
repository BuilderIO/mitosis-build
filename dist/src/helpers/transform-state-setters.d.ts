import { types } from '@babel/core';
declare type StateSetterTransformer = ({ path, propertyName, }: {
    path: babel.NodePath<types.AssignmentExpression>;
    propertyName: string;
}) => types.CallExpression;
/**
 * Finds instances of state being set in `value`, and transforms them using the
 * provided `transformer`.
 */
export declare const transformStateSetters: ({ value, transformer, }: {
    value: string;
    transformer: StateSetterTransformer;
}) => string;
export {};
