import { MitosisComponent } from '../types/mitosis-component';
export type RefMapper = (refName: string) => string;
export declare const mapRefs: (component: MitosisComponent, mapper: RefMapper) => void;
