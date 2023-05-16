import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { MitosisNode } from '../../../types/mitosis-node';
import type { SveltosisComponent } from '../types';
export declare function parseEach(json: SveltosisComponent, node: TemplateNode): MitosisNode;
