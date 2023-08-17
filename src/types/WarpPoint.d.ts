import { RelativeLocation } from "./GatherPoint";

export type TextStrEntry = {
    id: string;
    ja_JP: string;
    en_US?: string;
    zh_CN?: string;
}

export type WarpPoint = {
    WarpPointId: string;
    WarpPointTag: string;
    WarpPointKey: string;
    RelativeLocation: RelativeLocation;
    Data?: TextStrEntry;
}
  