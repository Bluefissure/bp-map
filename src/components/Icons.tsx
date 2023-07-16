import * as L from 'leaflet';
import MineralIconImg from '../assets/icon/Gather/UI_IconGatherMineral.png';
import PlantIconImg from '../assets/icon/Gather/UI_IconGatherPlant.png';
import AquaticIconImg from '../assets/icon/Gather/UI_IconGatherAquatic.png';
import MineralGIconImg from '../assets/icon/Gather/UI_IconGatherMineral_G.png';
import PlantGIconImg from '../assets/icon/Gather/UI_IconGatherPlant_G.png';
import AquaticGIconImg from '../assets/icon/Gather/UI_IconGatherAquatic_G.png';

const ICON_SIZE = 36;

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
