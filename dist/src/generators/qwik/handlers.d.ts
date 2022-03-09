import { MitosisNode } from '../../types/mitosis-node';
import { File } from './src-generator';
export declare function extractJSBlock(binding: any): string | null;
export declare function renderHandlers(file: File, componentName: string, children: MitosisNode[]): Map<string, string>;
