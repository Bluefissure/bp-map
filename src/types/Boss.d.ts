import { RelativeLocation, TextEntry } from "./GatherPoint";

export type Enemy = {
    EnemyId: string;
    MinLv: number;
    MaxLv: number;
    Name: TextEntry;
}

export type BossData = {
    id: string;
    members: Enemy[];
}


export type QuestConditionEntry = {
    type: number;
    params: string[];
    name?: TextEntry;
}

export type QuestCondition = {
    [key: string]: QuestConditionEntry,
}

export type QuestData = {
    id: string;
    area_radius: number;
    judgment_area_size: number;
    quest_time_limit: number;
    cool_time: number;
    conditions: QuestCondition;
}

export type Boss = {
    QuestId: string;
    QuestTag: string;
    QuestKey: string;
    RelativeLocation: RelativeLocation;
    Data?: BossData;
    QuestData?: QuestData;
}