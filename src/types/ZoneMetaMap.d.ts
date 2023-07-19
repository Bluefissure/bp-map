
import { WarpPoint } from './WarpPoint';
import { GatherPoint } from './GatherPoint';
import { TreasureBox } from './TreasureBox';
import { FreeBuff } from './FreeBuff';

export type ZoneName = {
    ja_JP: string;
    en_US?: string;
    zh_CN?: string;
}

export type ZoneMetaMap = {
    [key: string]: {
        bgFile: string;
        topFileKey: string;
        warpPoints?: WarpPoint[];
        gatherPoints?: GatherPoint[];
        treasureBoxes?: TreasureBox[];
        freeBuffs?: FreeBuff[];
        name?: ZoneName;
    };
};
