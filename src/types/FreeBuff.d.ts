import { RelativeLocation, TextEntry } from "./GatherPoint";

export type FreeBuffLot = {
    type: number;
    rate: number;
    text: TextEntry;
}

export type FreeBuffPointData = {
    id: number;
    lot_rate: FreeBuffLot[];
}

export type FreeBuff = {
    FreeBuffPointId: number;
    FreeBuffPointTag: string;
    FreeBuffPointKey: string;
    RelativeLocation: RelativeLocation;
    Data: FreeBuffPointData;
}
  