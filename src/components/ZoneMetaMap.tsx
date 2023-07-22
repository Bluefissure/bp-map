
import mapCty001 from '../assets/map/Cty001/UI_MapCty001.webp';
import mapCty002 from '../assets/map/Cty002/UI_MapCty002.webp';
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
import trFld003 from '../assets/data/fld003/Treasures.json';
import trFld004 from '../assets/data/fld004/Treasures.json';
import trDng007 from '../assets/data/dng007/Treasures.json';
import trDng009 from '../assets/data/dng009/Treasures.json';
import trPat0201 from '../assets/data/pat0201/Treasures.json';
import trPat0801 from '../assets/data/pat0801/Treasures.json';
import trPat0802 from '../assets/data/pat0802/Treasures.json';
import trPat0803 from '../assets/data/pat0803/Treasures.json';

import wpCty001 from '../assets/data/cty01/WarpPoints.json';
import wpCty002 from '../assets/data/cty02/WarpPoints.json';
import wpFld001 from '../assets/data/fld001/WarpPoints.json';
import wpFld002 from '../assets/data/fld002/WarpPoints.json';
import wpFld003 from '../assets/data/fld003/WarpPoints.json';
import wpFld004 from '../assets/data/fld004/WarpPoints.json';
import wpDng007 from '../assets/data/dng007/WarpPoints.json';
import wpDng009 from '../assets/data/dng009/WarpPoints.json';
import wpPat0201 from '../assets/data/pat0201/WarpPoints.json';
import wpPat0801 from '../assets/data/pat0801/WarpPoints.json';
import wpPat0802 from '../assets/data/pat0802/WarpPoints.json';
import wpPat0803 from '../assets/data/pat0803/WarpPoints.json';


import fbFld001 from '../assets/data/fld001/FreeBuffs.json';
import fbFld002 from '../assets/data/fld002/FreeBuffs.json';
import fbFld003 from '../assets/data/fld003/FreeBuffs.json';
import fbFld004 from '../assets/data/fld004/FreeBuffs.json';

import npFld001 from '../assets/data/fld001/Nappos.json';
import npFld002 from '../assets/data/fld002/Nappos.json';
import npFld003 from '../assets/data/fld003/Nappos.json';
import npFld004 from '../assets/data/fld004/Nappos.json';


import bossFld001 from '../assets/data/fld001/Bosses.json';
import bossFld002 from '../assets/data/fld002/Bosses.json';
import bossFld003 from '../assets/data/fld003/Bosses.json';
import bossFld004 from '../assets/data/fld004/Bosses.json';
import bossDng007 from '../assets/data/dng007/Bosses.json';
import bossDng009 from '../assets/data/dng009/Bosses.json';
import bossPat0201 from '../assets/data/pat0201/Bosses.json';
import bossPat0801 from '../assets/data/pat0801/Bosses.json';
import bossPat0802 from '../assets/data/pat0802/Bosses.json';
import bossPat0803 from '../assets/data/pat0803/Bosses.json';

import habiFld001 from '../assets/data/fld001/Habitats.json';
import habiFld002 from '../assets/data/fld002/Habitats.json';
import habiFld003 from '../assets/data/fld003/Habitats.json';
import habiFld004 from '../assets/data/fld004/Habitats.json';
import habiDng007 from '../assets/data/dng007/Habitats.json';
import habiDng009 from '../assets/data/dng009/Habitats.json';
import habiPat0201 from '../assets/data/pat0201/Habitats.json';
import habiPat0801 from '../assets/data/pat0801/Habitats.json';
import habiPat0802 from '../assets/data/pat0802/Habitats.json';
import habiPat0803 from '../assets/data/pat0803/Habitats.json';

import { ZoneMetaMap } from '../types/ZoneMetaMap';

export const zoneMetaMap : ZoneMetaMap = {
    cty001: {
        bgFile: mapCty001,
        topFileKey: 'cty01_Top',
        warpPoints: wpCty001,
    },
    cty002: {
        bgFile: mapCty002,
        topFileKey: 'cty02_Top',
        warpPoints: wpCty002,
    },
    fld001: {
        bgFile: mapFld001,
        topFileKey: 'fld001_Top',
        warpPoints: wpFld001,
        gatherPoints: gpFld001,
        treasureBoxes: trFld001,
        freeBuffs: fbFld001,
        nappos: npFld001,
        bosses: bossFld001,
        habitats: habiFld001,
    },
    fld002: {
        bgFile: mapFld002,
        topFileKey: 'fld002_Top',
        warpPoints: wpFld002,
        gatherPoints: gpFld002,
        treasureBoxes: trFld002,
        freeBuffs: fbFld002,
        nappos: npFld002,
        bosses: bossFld002,
        habitats: habiFld002,
    },
    fld003: {
        bgFile: mapFld003,
        topFileKey: 'fld003_Top',
        warpPoints: wpFld003,
        gatherPoints: gpFld003,
        treasureBoxes: trFld003,
        freeBuffs: fbFld003,
        nappos: npFld003,
        bosses: bossFld003,
        habitats: habiFld003,
    },
    fld004: {
        bgFile: mapFld004,
        topFileKey: 'fld004_Top',
        warpPoints: wpFld004,
        gatherPoints: gpFld004,
        treasureBoxes: trFld004,
        freeBuffs: fbFld004,
        nappos: npFld004,
        bosses: bossFld004,
        habitats: habiFld004,
    },
    dng007: {
        bgFile: mapDng007,
        topFileKey: 'dng007_Top',
        warpPoints: wpDng007,
        gatherPoints: gpDng007,
        treasureBoxes: trDng007,
        bosses: bossDng007,
        habitats: habiDng007,
        name: {
            ja_JP: '枷神の産屋',
        }
    },
    dng009: {
        bgFile: mapDng009,
        topFileKey: 'dng009_Top',
        warpPoints: wpDng009,
        gatherPoints: gpDng009,
        treasureBoxes: trDng009,
        bosses: bossDng009,
        habitats: habiDng009,
        name: {
            ja_JP: '巨竜の爪痕',
        }
    },
    pat0201: {
        bgFile: mapPat0201,
        topFileKey: 'pat0201_Top_F1',
        warpPoints: wpPat0201,
        gatherPoints: gpPat0201,
        treasureBoxes: trPat0201,
        bosses: bossPat0201,
        habitats: habiPat0201,
        name: {
            ja_JP: 'ボルオム遺跡',
        }
    },
    pat0801: {
        bgFile: mapPat0801,
        topFileKey: 'pat0801_Top',
        warpPoints: wpPat0801,
        gatherPoints: gpPat0801,
        treasureBoxes: trPat0801,
        bosses: bossPat0801,
        habitats: habiPat0801,
        name: {
            ja_JP: '木漏れ日射す林道',
        }
    },
    pat0802: {
        bgFile: mapPat0802,
        topFileKey: 'pat0802_Top',
        warpPoints: wpPat0802,
        gatherPoints: gpPat0802,
        treasureBoxes: trPat0802,
        bosses: bossPat0802,
        habitats: habiPat0802,
        name: {
            ja_JP: 'ともし火の森',
        }
    },
    pat0803: {
        bgFile: mapPat0803,
        topFileKey: 'pat0803_Top',
        warpPoints: wpPat0803,
        gatherPoints: gpPat0803,
        treasureBoxes: trPat0803,
        bosses: bossPat0803,
        habitats: habiPat0803,
        name: {
            ja_JP: '雨止まぬ森',
        }
    }
}
