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
export interface MapBoss {
    type: 'Boss';
    key: string;
}

export type MapContent = MapTreasure[] | MapFreeBuff[];

export type MapMarker = {
    key: string,
    dataType: string,
    markerType: string;
    position: LatLng;
    icon: L.Icon;
    content: MapContent;
};
