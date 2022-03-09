import { TraverseContext } from 'traverse';
import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
export declare const getRenderOptions: (node: MitosisNode) => {
    [x: string]: string;
};
declare type CompileAwayComponentsOptions = {
    components: {
        [key: string]: (node: MitosisNode, context: TraverseContext) => MitosisNode | void;
    };
};
/**
 * @example
 *    componentToReact(mitosisJson, {
 *      plugins: [
 *        compileAwayComponents({
 *          Image: (node) => {
 *             return jsx(`
 *               <div>
 *                 <img src="${node.properties.image}" />
 *               </div>
 *             `);
 *          }
 *        })
 *      ]
 *    })
 */
export declare const compileAwayComponents: (pluginOptions: CompileAwayComponentsOptions) => (options?: any) => {
    json: {
        pre: (json: MitosisComponent) => void;
    };
};
export {};
