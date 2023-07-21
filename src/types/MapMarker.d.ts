import * as L from 'leaflet';
import { LatLng } from 'leaflet';

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
}

export type MapContent = MapTreasure[] | MapFreeBuff[] | MapWarpPoint | MapNappo;

export type MapMarker = {
    key: string,
    dataType: string,
    markerType: string;
    zIndex: number;
    position: LatLng;
    icon: L.Icon;
    content: MapContent;
};
