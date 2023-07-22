import { RelativeLocation } from "./GatherPoint";
import { Enemy } from "./Boss";

export type HabitatData = {
    id: string;
    members: Enemy[];
}

export type Habitat = {
    HabitatId: string;
    HabitatTag: string;
    HabitatKey: string;
    RelativeLocation: RelativeLocation;
    Data?: HabitatData;
}