import * as L from 'leaflet';
import MineralIconImg from '../assets/icon/Gather/UI_IconGatherMineral.webp';
import PlantIconImg from '../assets/icon/Gather/UI_IconGatherPlant.webp';
import AquaticIconImg from '../assets/icon/Gather/UI_IconGatherAquatic.webp';
import MineralGIconImg from '../assets/icon/Gather/UI_IconGatherMineral_G.webp';
import PlantGIconImg from '../assets/icon/Gather/UI_IconGatherPlant_G.webp';
import AquaticGIconImg from '../assets/icon/Gather/UI_IconGatherAquatic_G.webp';
import TreasureIconImg from '../assets/icon/Map/treasurebox.webp';

const ICON_SIZE = 36;
const ICON_SIZE_SMALL = 24;

export const MineralIcon = L.icon({
    iconUrl: MineralIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});

export const MineralGIcon = L.icon({
    iconUrl: MineralGIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});

export const PlantIcon = L.icon({
    iconUrl: PlantIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});

export const PlantGIcon = L.icon({
    iconUrl: PlantGIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});

export const AquaticIcon = L.icon({
    iconUrl: AquaticIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});

export const AquaticGIcon = L.icon({
    iconUrl: AquaticGIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});

export const TreasureIcon = L.icon({
    iconUrl: TreasureIconImg,
    iconSize: [ICON_SIZE_SMALL, ICON_SIZE_SMALL],
    iconAnchor: [ICON_SIZE_SMALL / 2, ICON_SIZE_SMALL / 2],
    popupAnchor: [0, - ICON_SIZE_SMALL / 2],
});
