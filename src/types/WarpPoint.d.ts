import { RelativeLocation } from "./GatherPoint";

export type TextStrEntry = {
    id: string;
    ja_JP: string;
}

export type WarpPoint = {
    WarpPointId: string;
    WarpPointTag: string;
    WarpPointKey: string;
    RelativeLocation: RelativeLocation;
    Data: TextStrEntry;
}
  