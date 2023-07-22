import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import crossfilter from 'crossfilter2';
import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';

import bgConfigJson from '../assets/data/bgconfig.json';
import { zoneMetaMap } from './ZoneMetaMap';
import { MapDrawer } from './MapDrawer';

import { ZoneConfig } from '../types/ZoneConfig';
import { MapMarker, MapTreasure, MapFreeBuff, MapWarpPoint, MapNappo, MapBoss } from '../types/MapMarker';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GTranslateIcon from '@mui/icons-material/GTranslate';

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
} from './Icons';
import { RelativeLocation } from '../types/GatherPoint';
import i18n from '../i18n';
import { useStateWithLS } from '../customHooks/useStateWithLS';


export const MyMapContainer = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const zoneIdParam = searchParams.get('zone_id');
    const [zoneId, setZoneId] = useStateWithLS('zoneId', zoneIdParam ?? 'fld001');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [langDialogOpen, setLangDialogOpen] = useState(false);
    const [uiLang, setUILang] = useState(i18n.language);
    const [dataLang, setDataLang] = useState('ja_JP');

    useEffect(() => {
        document.title = 'Blue Protocol Interactive Map';
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const zoneIdParam = searchParams.get('zone_id');
        if (zoneIdParam && zoneId != zoneIdParam) {
            setZoneId(zoneIdParam);
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
    const bgConfig: {
        [key: string]: ZoneConfig
    } = bgConfigJson;
    const zoneConfig = bgConfig[zoneTopKey];

    const calcMapPosition = (rel: RelativeLocation, zoneConfig: ZoneConfig, mapSize: LatLng) => {
        const worldX = rel.X;
        const worldY = rel.Y;
        const mapLat = (zoneConfig.CaptureSize.Y - (worldY - zoneConfig.CapturePosition.Y)) / zoneConfig.CaptureSize.Y * mapSize.lat;
        const mapLng = (worldX - zoneConfig.CapturePosition.X) / zoneConfig.CaptureSize.X * mapSize.lng;
        return new LatLng(mapLat, mapLng);
    }
    
    const gpMarkers = gatherPoints.map((gp) => {
        const position = calcMapPosition(gp.RelativeLocation, zoneConfig, mapSize);
        let gatherType = t('markerType.gatheringMineral');
        const onlyOneTrasure = (gp.Data.lot_rate.length === 1) && (gp.Data.lot_rate[0].rate === 10000);
        let icon = onlyOneTrasure ? MineralGIcon : MineralIcon;
        if (gp.GatherPointTag.startsWith('P')) {
            gatherType = t('markerType.gatheringPlant');
            icon = onlyOneTrasure ? PlantGIcon : PlantIcon;
        } else if (gp.GatherPointTag.startsWith('A')) {
            gatherType = t('markerType.gatheringAquatic');
            icon = onlyOneTrasure ? AquaticGIcon : AquaticIcon;
        }
        const treasures = gp.Data.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item, idx) => {
                let amount = `x${item.reward_amount_min}-${item.reward_amount_max}`;
                if (item.reward_amount_min === item.reward_amount_max) {
                    amount = item.reward_amount_min === 1 ? '' : `x${item.reward_amount_min}`;
                }
                return {
                    key: `item-treasure-${idx}`,
                    amount: amount,
                    name:  item.text.ja_JP,
                    rate: `${Math.floor(item.rate / 100)}%`,
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
    });

    const trMarkers = treasureBoxes.map((tr) => {
        const position = calcMapPosition(tr.RelativeLocation, zoneConfig, mapSize);
        let markerType = t('markerType.treasureBox');
        let icon = TreasureIcon;
        if (tr.Data.lot_rate.length > 0) {
            if (tr.Data.lot_rate[0].reward_type == 15) {
                markerType = t('markerType.treasureBoxLM');
                icon = TreasureLMIcon;
            } else if (tr.Data.lot_rate[0].reward_type == 28) {
                markerType = t('markerType.treasureBoxAB');
                icon = TreasureABIcons[tr.Data.lot_rate[0].reward_master_id] ?? TreasureABIcons['_'];
            }
        }
        const treasures = tr.Data.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item, idx) => {
                let amount = `x${item.reward_amount_min}-${item.reward_amount_max}`;
                if (item.reward_amount_min === item.reward_amount_max) {
                    amount = item.reward_amount_min === 1 ? '' : `x${item.reward_amount_min}`;
                }
                return {
                    key: `item-treasure-${idx}`,
                    amount: amount,
                    name:  item.text.ja_JP,
                    rate: `${Math.floor(item.rate / 100)}%`,
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
    });

    const fbMarkers = freeBuffs.map((fb) => {
        const position = calcMapPosition(fb.RelativeLocation, zoneConfig, mapSize);
        const gatherType = t('markerType.freeBuff');
        const freebuffs = fb.Data.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item, idx) => {
                return {
                    key: `freebuff-${idx}`,
                    name:  item.text.ja_JP,
                    rate: `${Math.floor(item.rate / 100)}%`,
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
    });

    const wpMarkers = warpPoints.map((wp) => {
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
                name: wp.Data.ja_JP,
            } as MapWarpPoint,
        } as MapMarker;
    });

    const npMarkers = nappos.map((np) => {
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
    });

    const bossMarkers = bosses.map((boss) => {
        const position = calcMapPosition(boss.RelativeLocation, zoneConfig, mapSize);
        const markerType = t('markerType.boss');
        const name = boss.Data?.members[0].Name.ja_JP;
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
    });


    const markers = [...gpMarkers, ...trMarkers, ...fbMarkers, ...wpMarkers, ...npMarkers, ...bossMarkers] as MapMarker[];
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

    const markerContentRender = (marker: MapMarker) => {
        const { dataType, content } = marker;
        if (Array.isArray(content)) {
            if (['GatherPoint', 'TreasureBox', 'FreeBuff'].indexOf(dataType) !== -1) {
                const header = (<div className='font-extrabold mb-2'>{marker.markerType}</div>);
                return (
                    <>
                        {header}
                        {content.map((tr)=> (
                            <div className="flex justify-between items-center" key={tr.key}>
                                <div>
                                    {tr.name}
                                </div>
                                <div className="space-x-4">
                                    <span>{tr.amount}</span>
                                    <span> </span>
                                </div>
                                <div >
                                    {tr.rate}
                                </div>
                            </div>
                        ))}
                    </>
                );
            }
        } else {
            if (dataType === 'WarpPoint') {
                const header = (<div className='font-extrabold mb-2'>{marker.markerType}</div>);
                return (
                    <>
                        {header}
                        {content.name}
                    </>
                );
            } else if (dataType === 'Boss') {
                const header = (<div className='font-extrabold'>{content.name}</div>);
                const minLv = (content as MapBoss).data?.members[0].MinLv ?? 0;
                const maxLv = (content as MapBoss).data?.members[0].MaxLv ?? 0;
                let lvStr = `Lv.${minLv}`;
                if (maxLv !== minLv) {
                    lvStr += `~${maxLv}`;
                }
                const cdStr = (content as MapBoss).questData?.cool_time ?? 0;
                const lvCdDom = (
                    <div className="flex justify-between items-center mb-1">
                        <div className='text-xs'>{lvStr}</div>
                        <div className="space-x-4">
                            <span> </span>
                            <span> </span>
                        </div>
                        <div className='text-xs'>
                            <Trans
                                i18nKey={'bossCondition.cd'}
                                defaults='CD: {{cd}}m'
                                values={{cd: cdStr}}
                            />
                        </div>
                    </div>
                );
                const conditionsDom = [] as JSX.Element[];
                const conditions = (content as MapBoss).questData?.conditions;
                if (conditions) {
                    if(conditions[1].type === 2 || conditions[1].type === 3){
                        conditionsDom.push((
                            <li key="cond_1">
                                <Trans i18nKey={
                                    conditions[1].type === 3
                                        ? 'bossCondition.appearsAtNight'
                                        : 'bossCondition.appearsDuringTheDay'
                                }>
                                    Appears {conditions[1].type === 3 ? 'at night' : 'during the day'}
                                </Trans>
                            </li>
                        ))
                    }
                    const keyList = ['2_1', '2_2', '2_3'];
                    keyList.forEach((key) => {
                        const entry = conditions[key] ?? {};
                        if (entry.type === 1) {
                            conditionsDom.push((
                                <li key={`cond_${key}`}>
                                    <Trans
                                        i18nKey={'bossCondition.killEnemies'}
                                        defaults="Kill {{amount}} {{enemy}}"
                                        values={{
                                            amount: entry.params[1],
                                            enemy: entry.name?.ja_JP,
                                        }}
                                    />
                                </li>
                            ))
                        } else if (entry.type === 3 && entry.params[0].indexOf('Gimmick') !== -1) {
                            conditionsDom.push((
                                <li key={`cond_${key}`}>
                                    <Trans
                                        i18nKey={'bossCondition.openTreasureBox'}
                                        defaults="Open treasure box"
                                    />
                                </li>
                            ))
                        } else if (entry.type === 9) {
                            conditionsDom.push((
                                <li key={`cond_${key}`}>
                                    <Trans
                                        i18nKey={'bossCondition.numberOfPlayers'}
                                        defaults="{{amount}} players around"
                                        values={{
                                            amount: Number.parseInt(entry.params[0]),
                                        }}
                                    />
                                </li>
                            ))
                        } else if (entry.type > 0){
                            conditionsDom.push((
                                <li key={`cond_${key}`}>
                                    <Trans
                                        i18nKey={'bossCondition.unknownCondition'}
                                        defaults="Unknown condition ({{type}})"
                                        values={{
                                            type: entry.type,
                                        }}
                                    />
                                </li>
                            ))
                        }
                    })
                }
                return (
                    <>
                        {header}
                        {lvCdDom}
                        <div>
                            <Trans
                                i18nKey={'bossCondition.conditions'}
                                defaults="Conditions:"
                            />
                            {conditionsDom}
                        </div>
                    </>
                );
            }
        }
        return '';
    };

    const renderedMarkers = filteredMarkers.map((marker) => {
        return (
            <Marker position={marker.position} icon={marker.icon} key={marker.key} zIndexOffset={marker.zIndex * 1000}>
                <Popup className='w-auto max-w-6xl'>
                    {markerContentRender(marker)}
                </Popup>
            </Marker>
        );
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
                                    onChange={(e) => {setDataLang(e.target.value);}}
                                    input={<OutlinedInput label="Data" />}
                                >
                                    <MenuItem value={'ja_JP'}>Japanese</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setLangDialogOpen(false);}}>Cancel</Button>
                    <Button onClick={() => {
                        i18n.changeLanguage(uiLang).then(() => {
                            navigate(0);
                        }).catch((e) => {console.error(e);});
                    }}>Ok</Button>
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
                <ImageOverlay
                    attribution='&copy;BANDAI NAMCO Online Inc. &copy; BANDAI NAMCO Studios Inc.'
                    url={zoneMetaMap[zoneId].bgFile}
                    bounds={bounds}
                />
                {renderedMarkers}
            </MapContainer>

            <MapDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={(value: boolean) => {setDrawerOpen(value)}}
                zoneId={zoneId}
                setZoneId={(zId: string) => {setZoneId(zId)}}
                markerTypeDim={markerTypeDim}
                contentDim={contentDim}
                contentDimGroupAll={contentDimGroupAll}
                markerTypeIconMap={markerTypeIconMap}
            />
            
        </Box>
    );
}