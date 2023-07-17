export type RelativeLocation = {
    X: number;
    Y: number;
    Z: number;
}

export type RewardText = {
    id: number;
    ja_JP: string;
}

export type Reward = {
    reward_master_id: number;
    reward_amount_min: number;
    reward_amount_max: number;
    rate: number;
    text: RewardText;
}

export type GatherPointData = {
    id: number;
    lot_rate: Reward[];
}

export type GatherPoint = {
    GatherPointId: number;
    GatherPointTag: string;
    GatherPointKey: string;
    RelativeLocation: RelativeLocation;
    Data: GatherPointData;
}
  