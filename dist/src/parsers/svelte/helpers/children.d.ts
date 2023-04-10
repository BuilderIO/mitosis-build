import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { MitosisNode } from '../../../types/mitosis-node';
import type { SveltosisComponent } from '../types';
export declare function filterChildren(children: TemplateNode[]): TemplateNode[];
export declare function parseChildren(json: SveltosisComponent, node: TemplateNode): MitosisNode[];
