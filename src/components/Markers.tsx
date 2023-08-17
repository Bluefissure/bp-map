
import { LatLng } from 'leaflet';

import { GatherPoint, RelativeLocation } from '../types/GatherPoint';
import { ZoneConfig } from '../types/ZoneConfig';
import {
    MineralIcon,
    PlantIcon,
    AquaticIcon,
    MineralGIcon,
    PlantGIcon,
    AquaticGIcon,
    TreasureIcon,
    TreasureLMIcon,
    TreasureABIcons,
    FreeBuffIcon,
    WarpPointIcon,
    NappoIcon,
    BossIcon,
    HabitatIcon,
} from './Icons';
import { getLocalText } from './MapContainer';
import { MapBoss, MapFreeBuff, MapHabitat, MapMarker, MapNappo, MapTreasure, MapWarpPoint } from '../types/MapMarker';
import { TreasureBox } from '../types/TreasureBox';
import { FreeBuff } from '../types/FreeBuff';
import { WarpPoint } from '../types/WarpPoint';
import { Nappo } from '../types/Nappo';
import { Boss } from '../types/Boss';
import { Habitat } from '../types/Habitat';
import { TFunction } from 'i18next';

const calcMapPosition = (rel: RelativeLocation, zoneConfig: ZoneConfig, mapSize: LatLng) => {
    const worldX = rel.X;
    const worldY = rel.Y;
    const mapLat = (zoneConfig.CaptureSize.Y - (worldY - zoneConfig.CapturePosition.Y)) / zoneConfig.CaptureSize.Y * mapSize.lat;
    const mapLng = (worldX - zoneConfig.CapturePosition.X) / zoneConfig.CaptureSize.X * mapSize.lng;
    return new LatLng(mapLat, mapLng);
}


export const genGpMarkers = (t: TFunction, gatherPoints: GatherPoint[], zoneConfig: ZoneConfig, mapSize: LatLng, dataLang: string) => (
    gatherPoints.map((gp) => {
        const position = calcMapPosition(gp.RelativeLocation, zoneConfig, mapSize);
        let gatherType = t('markerType.gatheringMineral');
        const onlyOneTrasure = (gp.Data?.lot_rate.length === 1) && (gp.Data?.lot_rate[0].rate === 10000);
        let icon = onlyOneTrasure ? MineralGIcon : MineralIcon;
        if (gp.GatherPointTag.startsWith('P')) {
            gatherType = t('markerType.gatheringPlant');
            icon = onlyOneTrasure ? PlantGIcon : PlantIcon;
        } else if (gp.GatherPointTag.startsWith('A')) {
            gatherType = t('markerType.gatheringAquatic');
            icon = onlyOneTrasure ? AquaticGIcon : AquaticIcon;
        }
        const treasures = gp.Data?.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item, idx) => {
                let amount = `x${item.reward_amount_min}-${item.reward_amount_max}`;
                if (item.reward_amount_min === item.reward_amount_max) {
                    amount = item.reward_amount_min === 1 ? '' : `x${item.reward_amount_min}`;
                }
                return {
                    key: `item-treasure-${idx}`,
                    amount: amount,
                    name:  getLocalText(item.text, dataLang),
                    rate: `${Math.floor(item.rate) / 100}%`,
                } as MapTreasure;
            });
        return {
            key: gp.GatherPointKey,
            zIndex: 1,
            dataType: 'GatherPoint',
            markerType: gatherType,
            position,
            icon,
            content: treasures,
        } as MapMarker;
    }));

export const genTrMarkers = (t: TFunction, treasureBoxes: TreasureBox[], zoneConfig: ZoneConfig, mapSize: LatLng, dataLang: string) => (
    treasureBoxes.map((tr) => {
        const position = calcMapPosition(tr.RelativeLocation, zoneConfig, mapSize);
        let markerType = t('markerType.treasureBox');
        let icon = TreasureIcon;
        if (tr.Data && tr.Data.lot_rate.length > 0) {
            if (tr.Data?.lot_rate[0].reward_type == 15) {
                markerType = t('markerType.treasureBoxLM');
                icon = TreasureLMIcon;
            } else if (tr.Data?.lot_rate[0].reward_type == 28) {
                markerType = t('markerType.treasureBoxAB');
                const abIcon = TreasureABIcons[tr.Data.lot_rate[0].reward_master_id];
                if (!abIcon) {
                    console.warn(`Cannot get icon for ${tr.Data.lot_rate[0].reward_master_id}`)
                    icon = TreasureABIcons['_'];
                } else {
                    icon = abIcon
                }
            }
        }
        const treasures = tr.Data?.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item, idx) => {
                let amount = `x${item.reward_amount_min}-${item.reward_amount_max}`;
                if (item.reward_amount_min === item.reward_amount_max) {
                    amount = item.reward_amount_min === 1 ? '' : `x${item.reward_amount_min}`;
                }
                return {
                    key: `item-treasure-${idx}`,
                    amount: amount,
                    name:  getLocalText(item.text, dataLang),
                    rate: `${Math.floor(item.rate) / 100}%`,
                } as MapTreasure;
            });
        return {
            key: tr.TreasureBoxKey,
            zIndex: 2,
            dataType: 'TreasureBox',
            markerType: markerType,
            position,
            icon,
            content: treasures,
        } as MapMarker;
    }));

export const genFbMarkers = (t: TFunction, freeBuffs: FreeBuff[], zoneConfig: ZoneConfig, mapSize: LatLng, dataLang: string) => (
    freeBuffs.map((fb) => {
        const position = calcMapPosition(fb.RelativeLocation, zoneConfig, mapSize);
        const gatherType = t('markerType.freeBuff');
        const freebuffs = fb.Data.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item, idx) => {
                return {
                    key: `freebuff-${idx}`,
                    name:  getLocalText(item.text, dataLang),
                    rate: `${Math.floor(item.rate) / 100}%`,
                } as MapFreeBuff;
            });
        return {
            key: fb.FreeBuffPointKey,
            zIndex: 1,
            dataType: 'FreeBuff',
            markerType: gatherType,
            position,
            icon: FreeBuffIcon,
            content: freebuffs,
        } as MapMarker;
    }));

export const genWpMarkers = (t: TFunction, warpPoints: WarpPoint[], zoneConfig: ZoneConfig, mapSize: LatLng, dataLang: string) => (
    warpPoints.map((wp) => {
        const position = calcMapPosition(wp.RelativeLocation, zoneConfig, mapSize);
        const markerType = t('markerType.warpPoint');
        return {
            key: wp.WarpPointKey,
            dataType: 'WarpPoint',
            zIndex: 10,
            markerType: markerType,
            position,
            icon: WarpPointIcon,
            content: {
                type: 'WarpPoint',
                key: wp.WarpPointKey,
                name: getLocalText(wp.Data, dataLang),
            } as MapWarpPoint,
        } as MapMarker;
    })
);

export const genNpMarkers = (t: TFunction, nappos: Nappo[], zoneConfig: ZoneConfig, mapSize: LatLng) => (
    nappos.map((np) => {
        const position = calcMapPosition(np.RelativeLocation, zoneConfig, mapSize);
        const markerType = t('markerType.nappo');
        return {
            key: np.ProfileDataKey,
            dataType: 'Nappo',
            zIndex: 2,
            markerType: markerType,
            position,
            icon: NappoIcon,
            content: {
                type: 'Nappo',
                key: np.ProfileDataKey,
                name: '',
            } as MapNappo,
        } as MapMarker;
    })
);

export const genBossMarkers = (t: TFunction, bosses: Boss[], zoneConfig: ZoneConfig, mapSize: LatLng, dataLang: string) => (
    bosses.map((boss) => {
        const position = calcMapPosition(boss.RelativeLocation, zoneConfig, mapSize);
        const markerType = t('markerType.boss');
        const name = getLocalText(boss.Data?.members[0].Name, dataLang);
        return {
            key: boss.QuestKey,
            dataType: 'Boss',
            zIndex: 3,
            markerType: markerType,
            position,
            icon: BossIcon,
            content: {
                type: 'Boss',
                key: boss.QuestKey,
                name,
                data: boss.Data,
                questData: boss.QuestData,
            } as MapBoss,
        } as MapMarker;
    })
);

export const genHabiMarkers = (t: TFunction, habitats: Habitat[], zoneConfig: ZoneConfig, mapSize: LatLng) => (
    habitats.map((habi) => {
        const position = calcMapPosition(habi.RelativeLocation, zoneConfig, mapSize);
        const markerType = t('markerType.habitat');
        return {
            key: habi.HabitatKey,
            dataType: 'Habitat',
            zIndex: 1,
            markerType: markerType,
            position,
            icon: HabitatIcon,
            content: {
                type: 'Habitat',
                key: habi.HabitatKey,
                name: 'Habitat',
                data: habi.Data,
            } as MapHabitat,
        } as MapMarker;
    })
);