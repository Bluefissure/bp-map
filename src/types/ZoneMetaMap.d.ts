
import { GatherPoint } from './GatherPoint';

export type ZoneName = {
    ja_JP: string;
    en_US?: string;
    zh_CN?: string
}

export type ZoneMetaMap = {
    [key: string]: {
        bgFile: string;
        topFileKey: string;
        gatherPoints: GatherPoint[];
        name?: ZoneName;
    };
};
