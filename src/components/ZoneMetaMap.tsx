
import mapFld001 from '../assets/map/fld001/UI_MapFld001.webp';
import mapFld002 from '../assets/map/fld002/UI_MapFld002.webp';
import mapFld003 from '../assets/map/fld003/UI_Map_Fld003.webp';
import mapFld004 from '../assets/map/fld004/UI_Map_Fld004.webp';
import gpFld001 from '../assets/data/fld001/GatherPoints.json';
import gpFld002 from '../assets/data/fld002/GatherPoints.json';
import gpFld003 from '../assets/data/fld003/GatherPoints.json';
import gpFld004 from '../assets/data/fld004/GatherPoints.json';
import { ZoneMetaMap } from '../types/ZoneMetaMap';

export const zoneMetaMap : ZoneMetaMap = {
    fld001: {
        bgFile: mapFld001,
        topFileKey: 'fld001_Top',
        gatherPoints: gpFld001,
    },
    fld002: {
        bgFile: mapFld002,
        topFileKey: 'fld002_Top',
        gatherPoints: gpFld002,
    },
    fld003: {
        bgFile: mapFld003,
        topFileKey: 'fld003_Top',
        gatherPoints: gpFld003,
    },
    fld004: {
        bgFile: mapFld004,
        topFileKey: 'fld004_Top',
        gatherPoints: gpFld004,
    }
}
