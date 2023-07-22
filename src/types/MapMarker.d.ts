import * as L from 'leaflet';
import { LatLng } from 'leaflet';
import { BossData, QuestData } from './Boss';
import { HabitatData } from './Habitat';

export interface MapTreasure {
    type: 'Treasure';
    key: string;
    amount: string;
    name: string;
    rate: string;
}

export interface MapFreeBuff {
    type: 'FreeBuff';
    key: string;
    name: string;
    rate: string;
    amount?: string;
}
export interface MapWarpPoint {
    type: 'WarpPoint';
    key: string;
    name: string;
}
export interface MapNappo {
    type: 'Nappo';
    key: string;
    name: string;
}
export interface MapBoss {
    type: 'Boss';
    key: string;
    name: string;
    data?: BossData;
    questData?: QuestData;
}
export interface MapHabitat {
    type: 'Habitat';
    key: string;
    name?: string;
    data?: HabitatData;
}

export type MapContent = MapTreasure[]
    | MapFreeBuff[]
    | MapWarpPoint
    | MapNappo
    | MapBoss
    | MapHabitat;

export type MapMarker = {
    key: string,
    dataType: string,
    markerType: string;
    zIndex: number;
    position: LatLng;
    icon: L.Icon;
    content: MapContent;
};
