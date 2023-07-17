
import { GatherPoint } from './GatherPoint';

export type ZoneMetaMap = {
    [key: string]: {
        bgFile: string;
        topFileKey: string;
        gatherPoints: GatherPoint[];
    };
};
