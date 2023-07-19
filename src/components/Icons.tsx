import * as L from 'leaflet';
import MineralIconImg from '../assets/icon/Gather/UI_IconGatherMineral.webp';
import PlantIconImg from '../assets/icon/Gather/UI_IconGatherPlant.webp';
import AquaticIconImg from '../assets/icon/Gather/UI_IconGatherAquatic.webp';
import MineralGIconImg from '../assets/icon/Gather/UI_IconGatherMineral_G.webp';
import PlantGIconImg from '../assets/icon/Gather/UI_IconGatherPlant_G.webp';
import AquaticGIconImg from '../assets/icon/Gather/UI_IconGatherAquatic_G.webp';
import TreasureIconImg from '../assets/icon/Map/treasurebox.webp';
import TreasureLMIconImg from '../assets/icon/LiquidMemory/UI_LiquidMemoryListLvOn.webp';
import FreeBuffIconImg from '../assets/icon/Map/UI_Map_95.webp';

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

export const FreeBuffIcon = L.icon({
    iconUrl: FreeBuffIconImg,
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

export const TreasureLMIcon = L.icon({
    iconUrl: TreasureLMIconImg,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    popupAnchor: [0, - ICON_SIZE / 2],
});

import TreasureABIcon140048000 from '../assets/icon/Adventureboard/UI_Adventureboard_140048000.webp';
import TreasureABIcon140050000 from '../assets/icon/Adventureboard/UI_Adventureboard_140050000.webp';
import TreasureABIcon140042000 from '../assets/icon/Adventureboard/UI_Adventureboard_140042000.webp';
import TreasureABIcon140044000 from '../assets/icon/Adventureboard/UI_Adventureboard_140044000.webp';
import TreasureABIcon140038000 from '../assets/icon/Adventureboard/UI_Adventureboard_140038000.webp';
import TreasureABIcon140040000 from '../assets/icon/Adventureboard/UI_Adventureboard_140040000.webp';
import TreasureABIcon140035000 from '../assets/icon/Adventureboard/UI_Adventureboard_140035000.webp';
import TreasureABIcon140036000 from '../assets/icon/Adventureboard/UI_Adventureboard_140036000.webp';
import TreasureABIcon140043000 from '../assets/icon/Adventureboard/UI_Adventureboard_140043000.webp';
import TreasureABIcon140045000 from '../assets/icon/Adventureboard/UI_Adventureboard_140045000.webp';
import TreasureABIcon140047000 from '../assets/icon/Adventureboard/UI_Adventureboard_140047000.webp';
import TreasureABIcon140052000 from '../assets/icon/Adventureboard/UI_Adventureboard_140052000.webp';
import TreasureABIconNoData from '../assets/icon/Adventureboard/UI_Adventureboard_NoData.webp';

const ABIcons = {
    "140048000": TreasureABIcon140048000,
    "140050000": TreasureABIcon140050000,
    "140042000": TreasureABIcon140042000,
    "140044000": TreasureABIcon140044000,
    "140038000": TreasureABIcon140038000,
    "140040000": TreasureABIcon140040000,
    "140035000": TreasureABIcon140035000,
    "140036000": TreasureABIcon140036000,
    "140043000": TreasureABIcon140043000,
    "140045000": TreasureABIcon140045000,
    "140047000": TreasureABIcon140047000,
    "140052000": TreasureABIcon140052000,
    "_": TreasureABIconNoData,
};

const AbIconSize = [78, 48];
export const TreasureABIcons = Object.entries(ABIcons).reduce(
    (icons: {[key: string]: L.Icon}, [abId, iconUrl]) => {
        icons[abId] = L.icon({
            iconUrl: iconUrl,
            iconSize: [AbIconSize[0], AbIconSize[1]],
            iconAnchor: [AbIconSize[0] / 2, AbIconSize[1] / 2],
            popupAnchor: [0, - AbIconSize[1] / 2],
        })
        return icons;
    }, {}
);
