import * as L from 'leaflet';
import MineralIconImg from '../assets/icons/gather/UI_IconGatherMineral.png';
import PlantIconImg from '../assets/icons/gather/UI_IconGatherPlant.png';
import AquaticIconImg from '../assets/icons/gather/UI_IconGatherAquatic.png';

const ICON_SIZE = 24;

export const MineralIcon = L.icon({
    iconUrl: MineralIconImg,
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

export const AquaticIcon = L.icon({
    iconUrl: AquaticIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});
