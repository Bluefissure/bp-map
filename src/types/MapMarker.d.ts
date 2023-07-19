import * as L from 'leaflet';
import { LatLng } from 'leaflet';

export interface MapTreasure {
    type: 'Treasure',
    key: string;
    amount: string;
    name: string;
    rate: string;
}

export interface MapBoss {
    type: 'Boss',
    key: string;
}

export type MapContent = MapTreasure[] | MapBoss;

export type MapMarker = {
    key: string,
    markerType: string;
    position: LatLng;
    icon: L.Icon;
    content: MapContent;
};
