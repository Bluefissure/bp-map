
import mapFld001 from '../assets/map/Fld001/UI_MapFld001.webp';
import mapFld002 from '../assets/map/fld002/UI_MapFld002.webp';
import mapFld003 from '../assets/map/fld003/UI_Map_Fld003.webp';
import mapFld004 from '../assets/map/fld004/UI_Map_Fld004.webp';
import mapDng007 from '../assets/map/dng007/UI_Mapdng007.webp';
import mapDng009 from '../assets/map/dng009/UI_Mapdng009.webp';
import mapPat0201 from '../assets/map/pat0201/UI_Mappat0201.webp';
import mapPat0801 from '../assets/map/pat0801/UI_Mappat0801.webp';
import mapPat0802 from '../assets/map/pat0802/UI_Mappat0802.webp';
import mapPat0803 from '../assets/map/pat0803/UI_Mappat0803.webp';

import gpFld001 from '../assets/data/fld001/GatherPoints.json';
import gpFld002 from '../assets/data/fld002/GatherPoints.json';
import gpFld003 from '../assets/data/fld003/GatherPoints.json';
import gpFld004 from '../assets/data/fld004/GatherPoints.json';
import gpDng007 from '../assets/data/dng007/GatherPoints.json';
import gpDng009 from '../assets/data/dng009/GatherPoints.json';
import gpPat0201 from '../assets/data/pat0201/GatherPoints.json';
import gpPat0801 from '../assets/data/pat0801/GatherPoints.json';
import gpPat0802 from '../assets/data/pat0802/GatherPoints.json';
import gpPat0803 from '../assets/data/pat0803/GatherPoints.json';

import trFld001 from '../assets/data/fld001/Treasures.json';
import trFld002 from '../assets/data/fld002/Treasures.json';
// import trFld003 from '../assets/data/fld003/Treasures.json';
// import trFld004 from '../assets/data/fld004/Treasures.json';
// import trDng007 from '../assets/data/dng007/Treasures.json';
// import trDng009 from '../assets/data/dng009/Treasures.json';
// import trPat0201 from '../assets/data/pat0201/Treasures.json';
// import trPat0801 from '../assets/data/pat0801/Treasures.json';
// import trPat0802 from '../assets/data/pat0802/Treasures.json';
// import trPat0803 from '../assets/data/pat0803/Treasures.json';

import { ZoneMetaMap } from '../types/ZoneMetaMap';

export const zoneMetaMap : ZoneMetaMap = {
    fld001: {
        bgFile: mapFld001,
        topFileKey: 'fld001_Top',
        gatherPoints: gpFld001,
        treasureBoxes: trFld001,
    },
    fld002: {
        bgFile: mapFld002,
        topFileKey: 'fld002_Top',
        gatherPoints: gpFld002,
        treasureBoxes: trFld002,
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
    },
    dng007: {
        bgFile: mapDng007,
        topFileKey: 'dng007_Top',
        gatherPoints: gpDng007,
        name: {
            ja_JP: '枷神の産屋',
        }
    },
    dng009: {
        bgFile: mapDng009,
        topFileKey: 'dng009_Top',
        gatherPoints: gpDng009,
        name: {
            ja_JP: '巨竜の爪痕',
        }
    },
    pat0201: {
        bgFile: mapPat0201,
        topFileKey: 'pat0201_Top_F1',
        gatherPoints: gpPat0201,
        name: {
            ja_JP: 'ボルオム遺跡',
        }
    },
    pat0801: {
        bgFile: mapPat0801,
        topFileKey: 'pat0801_Top',
        gatherPoints: gpPat0801,
        name: {
            ja_JP: '木漏れ日射す林道',
        }
    },
    pat0802: {
        bgFile: mapPat0802,
        topFileKey: 'pat0802_Top',
        gatherPoints: gpPat0802,
        name: {
            ja_JP: 'ともし火の森',
        }
    },
    pat0803: {
        bgFile: mapPat0803,
        topFileKey: 'pat0803_Top',
        gatherPoints: gpPat0803,
        name: {
            ja_JP: '雨止まぬ森',
        }
    }
}
