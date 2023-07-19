import { RelativeLocation, GatherPointData } from "./GatherPoint";

export type TreasureBox = {
    TreasureBoxId: number;
    TreasureBoxTag: string;
    TreasureBoxKey: string;
    RelativeLocation: RelativeLocation;
    Data: GatherPointData;
};