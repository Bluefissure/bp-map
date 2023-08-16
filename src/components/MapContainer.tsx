import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useLoaderData, useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import crossfilter from 'crossfilter2';
import { MapContainer, ImageOverlay, Circle } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';

import bgConfigJson from '../assets/data/bgconfig.json';
import { zoneMetaMap } from './ZoneMetaMap';
import { MapDrawer } from './MapDrawer';

import { ZoneConfig } from '../types/ZoneConfig';
import { MapMarker, MapWarpPoint, MapNappo, MapBoss, MapHabitat } from '../types/MapMarker';
import { ContentType } from './MapDrawer';

import {
    Box,
    SpeedDial,
    SpeedDialAction,
    IconButton,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    OutlinedInput,
    Stack,
    Link,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {
    MineralIcon,
    PlantIcon,
    AquaticIcon,
    MineralGIcon,
    PlantGIcon,
    AquaticGIcon,
} from './Icons';
import { TextEntry } from '../types/GatherPoint';
import { TextStrEntry } from '../types/WarpPoint';
import { ZoneName } from '../types/ZoneMetaMap';
import i18n from '../i18n';
import { useStateWithLS } from '../customHooks/useStateWithLS';
import {
    genGpMarkers,
    genTrMarkers,
    genFbMarkers,
    genWpMarkers,
    genNpMarkers,
    genBossMarkers,
    genHabiMarkers,
} from './Markers';
import { markerTooltipRender } from './MarkerTooltip';

export type langType = 'ja_JP' | 'zh_CN' | 'en_US';

export const getLocalText = (
    entry: TextEntry | TextStrEntry | ZoneName | undefined,
    locale: string,
) => {
    if (!entry) return '';
    const localized = entry[locale as langType] ?? entry['ja_JP'];
    if (!localized) {
        return entry['ja_JP'];
    }
    return localized;
}

type loaderData = {
    zoneId?: string;
}

export const MyMapContainer = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const loaderData = useLoaderData() as loaderData;
    const [zoneId, setZoneId] = useStateWithLS('zoneId', 'fld001');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [langDialogOpen, setLangDialogOpen] = useState(false);
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
    const [linksDialogOpen, setLinksDialogOpen] = useState(false);
    const [uiLang, setUILang] = useState(i18n.language);
    const [dataLang, setDataLang] = useStateWithLS('dataLang', 'ja_JP');
    const [bossRanges, setBossRanges] = useState([] as JSX.Element[]);
    const [searchParams, setSearchParams] = useSearchParams();
    const dataLangPatchUrl = {
        ja_JP: '#',
        en_US: '#',
        zh_CN: 'https://blue-protocol.cn/cp/',
    };
    const isModule = !!(document.getElementById('bp-map') as HTMLElement);

    useEffect(() => {
        if (!isModule) {
            document.title = t('title');
        }
    }, []);

    useEffect(() => {
        const lng = searchParams.get('lng') as string;
        if (lng === 'zh_CN') {
            // setUILang('zh_CN'); // done by LanguageDetector
            setDataLang('zh_CN');
            const updatedSearchParams = new URLSearchParams(searchParams);
            updatedSearchParams.delete('lng');
            setSearchParams(updatedSearchParams);
            if(dataLang !== lng) {
                navigate(0);
            }
        }
    }, [location.search]);

    useEffect(() => {
        let tempZoneId = zoneId;
        if (loaderData.zoneId) {
            tempZoneId = loaderData.zoneId;
        }
        const validZoneIds = Object.keys(zoneMetaMap);
        const newZoneId = validZoneIds.indexOf(tempZoneId) === -1
            ? 'fld001' : tempZoneId;
        if (newZoneId !== zoneId) {
            setZoneId(newZoneId);
            navigate('/');
        }
    }, [location.search]);

    const mapSize = new LatLng(216, 380);
    const bounds = new LatLngBounds(
        new LatLng(0, 0),
        mapSize,
    );
    const maxBounds = new LatLngBounds(
        new LatLng(- mapSize.lat * 0.25, - mapSize.lng * 0.25),
        new LatLng(mapSize.lat * 1.25, mapSize.lng * 1.25),
    );
    const zoneTopKey = zoneMetaMap[zoneId].topFileKey;
    const gatherPoints = zoneMetaMap[zoneId].gatherPoints ?? [];
    const treasureBoxes = zoneMetaMap[zoneId].treasureBoxes ?? [];
    const freeBuffs = zoneMetaMap[zoneId].freeBuffs ?? [];
    const warpPoints = zoneMetaMap[zoneId].warpPoints ?? [];
    const nappos = zoneMetaMap[zoneId].nappos ?? [];
    const bosses = zoneMetaMap[zoneId].bosses?.filter((x) => x.Data) ?? [];
    const habitats = zoneMetaMap[zoneId].habitats?.filter((x) => x.Data) ?? [];
    const bgConfig: {
        [key: string]: ZoneConfig
    } = bgConfigJson;
    const zoneConfig = bgConfig[zoneTopKey];
    
    const gpMarkers = genGpMarkers(t, gatherPoints, zoneConfig, mapSize, dataLang);
    const trMarkers = genTrMarkers(t, treasureBoxes, zoneConfig, mapSize, dataLang);
    const fbMarkers = genFbMarkers(t, freeBuffs, zoneConfig, mapSize, dataLang);
    const wpMarkers = genWpMarkers(t, warpPoints, zoneConfig, mapSize, dataLang);
    const npMarkers = genNpMarkers(t, nappos, zoneConfig, mapSize);
    const bossMarkers = genBossMarkers(t, bosses, zoneConfig, mapSize, dataLang);
    const habiMarkers = genHabiMarkers(t, habitats, zoneConfig, mapSize);

    const markers = [
        ...gpMarkers,
        ...trMarkers,
        ...fbMarkers,
        ...wpMarkers,
        ...npMarkers,
        ...bossMarkers,
        ...habiMarkers,
    ] as MapMarker[];

    const markerTypeIconMap = {} as {[key:string]: string};
    markers.forEach((marker) => {
        let iconUrl = marker.icon.options.iconUrl;
        const normalIcons = [AquaticIcon, MineralIcon, PlantIcon];
        [AquaticGIcon, MineralGIcon, PlantGIcon].forEach((icon, idx) => {
            if (iconUrl === icon.options.iconUrl) {
                iconUrl = normalIcons[idx].options.iconUrl;
            }
        })
        markerTypeIconMap[marker.markerType] = iconUrl;
    })

    const cf = useMemo(() => crossfilter(markers), [markers, zoneId]);
    const markerTypeDim = useMemo(() => (cf.dimension((marker) => marker.markerType)), [cf]);
    const contentDim = useMemo(() => (cf.dimension((marker) => {
        const content = marker.content;
        if (Array.isArray(content)) {
            return content.map((ele) => (ele.name));
        } else {
            if (marker.dataType === 'WarpPoint') {
                return [(marker.content as MapWarpPoint).name];
            } else if (marker.dataType === 'Nappo') {
                return [(marker.content as MapNappo).name];
            } else if (marker.dataType === 'Boss') {
                return [(marker.content as MapBoss).name];
            } else if (marker.dataType === 'Habitat') {
                return (marker.content as MapHabitat).data?.members.map(
                    (member) => (getLocalText(member.Name, dataLang))
                ) ?? [];
            }
        }
        return [];
    }, true)), [cf]);
    const [filteredMarkers, setFilteredMarkers] = useState(cf.allFiltered());
    const updateMarkerContentToType = (_markers: MapMarker[]) => {
        const tempDict = {} as {[key: string]: string[]};
        _markers.forEach((marker) => {
            const content = marker.content;
            if (Array.isArray(content)) {
                content.forEach((ele) => {
                    tempDict[ele.name] = [...new Set([
                        ...(tempDict[ele.name] ?? []),
                        marker.markerType,
                    ])];
                })
                return content.map((ele) => (ele.name));
            } else {
                if (marker.dataType === 'WarpPoint') {
                    tempDict[(marker.content as MapWarpPoint).name] = [marker.markerType];
                } else if (marker.dataType === 'Boss') {
                    tempDict[(marker.content as MapBoss).name] = [marker.markerType];
                } else if (marker.dataType === 'Habitat') {
                    ((marker.content as MapHabitat).data?.members.map(
                        (member) => (getLocalText(member.Name, dataLang))
                    ) ?? []).forEach((v) => {
                        tempDict[v] = [marker.markerType];
                    })
                }
            }
        });
        return tempDict;
    }

    const markerContentToType = useMemo(() => {
        return updateMarkerContentToType(markers);
    }, [cf, markers]);

    const [contentDimGroupAll, setContentDimGroupAll] = useState(
        contentDim.group().all().filter((x) => (x.key)).map(
            (x) => ({
                key: x.key as string,
                value: x.value as number,
                types: markerContentToType[x.key as string] ?? [t('unknown')],
            } as ContentType)
        ));

    useEffect(() => {
        setBossRanges([]);
        setFilteredMarkers(cf.allFiltered());
    }, [zoneId]);


    cf.onChange(() => {
        setFilteredMarkers(cf.allFiltered());
        setContentDimGroupAll(contentDim.group().all().filter((x) => (x.key)).map(
            (x) => ({
                key: x.key as string,
                value: x.value as number,
                types: markerContentToType[x.key as string] ?? [t('unknown')],
            } as ContentType)
        ));
    });

    const onMarkerPopupShow = (marker: MapMarker, show: boolean) => {
        if (marker.dataType === 'Boss') {
            if (show) {
                const rawRadius = (marker.content as MapBoss).questData?.area_radius ?? 0;
                const radius = rawRadius / zoneConfig.CaptureSize.X * mapSize.lng;
                setBossRanges([
                    (<Circle
                        key={`bossrange-${marker.key}`}
                        center={marker.position}
                        radius={radius}
                        pathOptions={{color: 'red'}}
                    />),
                ]);
            } else {
                setBossRanges([]);
            }
        }
    }

    const renderedMarkers = filteredMarkers.map((marker) => {
        return markerTooltipRender(marker, dataLang, onMarkerPopupShow);
    })

    const center = new LatLng(mapSize.lat / 2, mapSize.lng / 2);
    
    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };
    return (
        <Box>
            <Dialog
                disableEscapeKeyDown
                open={langDialogOpen}
                onClose={() => {setLangDialogOpen(false);}}
            >
                <DialogTitle>
                    <Trans i18nKey={'settings.language.language'}>
                        Language
                    </Trans>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Stack>
                            <FormControl sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="ui-lang-select-label">
                                    <Trans i18nKey={'settings.language.ui'}>
                                    UI
                                    </Trans>
                                </InputLabel>
                                <Select
                                    labelId="ui-lang-select-label"
                                    id="ui-lang-select"
                                    value={uiLang}
                                    onChange={(e) => {setUILang(e.target.value);}}
                                    input={<OutlinedInput label="UI" id="ui-lang" />}
                                >
                                    <MenuItem value={'en'}>English</MenuItem>
                                    <MenuItem value={'zh_CN'}>Chinese Simplified</MenuItem>
                                    <MenuItem value={'ja_JP'}>Japanese</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="data-lang-select-label">
                                    <Trans i18nKey={'settings.language.data'}>
                                    Data
                                    </Trans>
                                </InputLabel>
                                <Select
                                    labelId="data-lang-select-label"
                                    id="data-lang-select"
                                    value={dataLang}
                                    onChange={(e) => {
                                        setDataLang(e.target.value);
                                    }}
                                    input={<OutlinedInput label="Data" />}
                                >
                                    <MenuItem value={'ja_JP'}>Japanese</MenuItem>
                                    <MenuItem value={'zh_CN'}>Chinese Simplified</MenuItem>
                                </Select>
                                {(['zh_CN', 'en_US'].indexOf(dataLang) !== -1) && (
                                    <Typography sx={{fontSize: 13}}>
                                        <Trans
                                            i18nKey={'settings.language.communityHint'}
                                            defaults="Data from a <1>community translation</1>."
                                        >
                                            Data from a <Link href={
                                                dataLangPatchUrl[dataLang as langType] ?? '#'
                                            } target="_blank">community translation</Link>
                                        </Trans>
                                    </Typography>
                                )}
                            </FormControl>
                            
                        </Stack>
                        
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setLangDialogOpen(false);}}>
                        <Trans i18nKey={'settings.language.cancel'} >
                            Cancel
                        </Trans>
                    </Button>
                    <Button onClick={() => {
                        i18n.changeLanguage(uiLang).then(() => {
                            navigate(0);
                        }).catch((e) => {console.error(e);});
                    }}>
                        <Trans i18nKey={'settings.language.ok'} >
                            OK
                        </Trans>
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Dialog
                disableEscapeKeyDown
                open={aboutDialogOpen}
                onClose={() => {setAboutDialogOpen(false);}}
            >
                <DialogTitle>
                    <Trans i18nKey={'settings.about.about'}>
                        About
                    </Trans>
                </DialogTitle>
                <DialogContent
                    sx={{minWidth: 200}}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Stack>
                            <Typography sx={{ mb:2 }}>
                                <Trans i18nKey={'settings.about.disclaimer'} />
                            </Typography>
                            <Box>
                                <Trans i18nKey={'settings.about.author'} >
                                    2023-2023 @Bluefissure
                                </Trans>
                                <Link
                                    href="https://github.com/Bluefissure"
                                    target="_blank"
                                    sx={{ ml: 2 }}
                                >
                                    Github
                                </Link>
                                <Link
                                    href="https://discord.com/users/348375771825569802"
                                    target="_blank"
                                    sx={{ ml: 1 }}
                                >
                                    Discord
                                </Link>
                            </Box>
                        </Stack>
                        
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setAboutDialogOpen(false);}}>
                        <Trans i18nKey={'settings.language.ok'} >
                            OK
                        </Trans>
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                disableEscapeKeyDown
                open={linksDialogOpen}
                onClose={() => {setLinksDialogOpen(false);}}
            >
                <DialogTitle>
                    <Trans i18nKey={'settings.links.links'}>
                        Useful Sites
                    </Trans>
                </DialogTitle>
                <DialogContent
                    sx={{minWidth: 200}}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Stack>
                            <Link
                                href="https://blue.queb.fun/clock/"
                                target="_blank"
                                sx={{ mb: 1 }}
                            >
                                <Trans i18nKey={'settings.links.clock'} >
                                    Calendar
                                </Trans>
                            </Link>
                            <Link
                                href="https://blue.queb.fun/board/"
                                target="_blank"
                                sx={{ mb: 1 }}
                            >
                                <Trans i18nKey={'settings.links.adventureBoard'} >
                                    Adventure Boards
                                </Trans>
                            </Link>
                            <Link
                                href="https://bp.incin.net/map/"
                                target="_blank"
                                sx={{ mb: 1 }}
                            >
                                <Trans i18nKey={'settings.links.incin'} >
                                    {"Incin's Map (incineratez)"}
                                </Trans>
                            </Link>
                            <Link
                                href="https://bapharia.com/db/"
                                target="_blank"
                                sx={{ mb: 1 }}
                            >
                                <Trans i18nKey={'settings.links.bapharia'} >
                                    {"Bapharia's Game DB (Zakum)"}
                                </Trans>
                            </Link>
                            <Link
                                href="https://bp-data.net/"
                                target="_blank"
                                sx={{ mb: 1 }}
                            >
                                <Trans i18nKey={'settings.links.bp-data'} >
                                    {"Blue Protocol Data (mrarm)"}
                                </Trans>
                            </Link>
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setLinksDialogOpen(false);}}>
                        <Trans i18nKey={'settings.language.ok'} >
                            OK
                        </Trans>
                    </Button>
                </DialogActions>
            </Dialog>

            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                sx={{
                    ...(drawerOpen && { display: 'none' }),
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px',
                    zIndex: '400',
                    background: 'white',
                }}
            >
                <MenuIcon />
            </IconButton>

            <SpeedDial
                ariaLabel="SpeedDial playground example"
                sx={{ 
                    ...(drawerOpen && { display: 'none' }),
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    padding: '10px',
                    zIndex: '400',
                }}
                icon={
                    <SpeedDialIcon
                        openIcon={<SettingsOutlinedIcon />}
                        icon={<SettingsIcon />}
                    />
                }
            >
                <SpeedDialAction
                    key={'links'}
                    icon={<FavoriteIcon />}
                    tooltipTitle={t('settings.links.links')}
                    onClick={() => {setLinksDialogOpen(!linksDialogOpen);}}
                />
                <SpeedDialAction
                    key={'about'}
                    icon={<InfoIcon />}
                    tooltipTitle={t('settings.about.about')}
                    onClick={() => {setAboutDialogOpen(!aboutDialogOpen);}}
                />
                <SpeedDialAction
                    key={'lang'}
                    icon={<GTranslateIcon />}
                    tooltipTitle={t('settings.language.language')}
                    onClick={() => {setLangDialogOpen(!langDialogOpen);}}
                />
            </SpeedDial>
            <MapContainer
                className='z-0'
                center={center}
                zoom={3}
                minZoom={2}
                maxZoom={6}
                scrollWheelZoom={true}
                crs={L.CRS.Simple}
                bounds={bounds}
                maxBounds={maxBounds}
            >
                {bossRanges}
                <ImageOverlay
                    attribution='&copy;BANDAI NAMCO Online Inc. &copy; BANDAI NAMCO Studios Inc.'
                    url={zoneMetaMap[zoneId].bgFile}
                    bounds={bounds}
                />
                {renderedMarkers}
            </MapContainer>

            <MapDrawer
                drawerOpen={drawerOpen}
                dataLang={dataLang}
                isModule={isModule}
                setDrawerOpen={(value: boolean) => {setDrawerOpen(value)}}
                zoneId={zoneId}
                setZoneId={(zId: string) => {
                    const validZoneIds = Object.keys(zoneMetaMap);
                    setZoneId(validZoneIds.indexOf(zId) !== -1 ? zId : 'fld001');
                }}
                markerTypeDim={markerTypeDim}
                contentDim={contentDim}
                contentDimGroupAll={contentDimGroupAll}
                markerTypeIconMap={markerTypeIconMap}
            />
            
        </Box>
    );
}