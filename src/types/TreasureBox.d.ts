type Data = {
    id: number;
    lot_rate: LotRate[];
};

type LotRate = {
    reward_master_id: number;
    reward_type: number;
    reward_amount_min: number;
    reward_amount_max: number;
    rate: number;
    text: {
        id: number;
        ja_JP: string;
    };
};

type RelativeLocation = {
    X: number;
    Y: number;
    Z: number;
};

export type TreasureBox = {
    TreasureBoxId: number;
    TreasureBoxTag: string;
    TreasureBoxKey: string;
    RelativeLocation: RelativeLocation;
    Data: Data;
};