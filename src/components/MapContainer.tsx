import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useLoaderData, useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import crossfilter from 'crossfilter2';
import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';

import bgConfigJson from '../assets/data/bgconfig.json';
import { zoneMetaMap } from './ZoneMetaMap';
import { MapDrawer } from './MapDrawer';

import { ZoneConfig } from '../types/ZoneConfig';
import { MapMarker, MapTreasure, MapFreeBuff, MapWarpPoint, MapNappo, MapBoss, MapHabitat } from '../types/MapMarker';
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
    TreasureIcon,
    TreasureLMIcon,
    TreasureABIcons,
    FreeBuffIcon,
    WarpPointIcon,
    NappoIcon,
    BossIcon,
    HabitatIcon,
} from './Icons';
import { RelativeLocation } from '../types/GatherPoint';
import { TextEntry } from '../types/GatherPoint';
import { TextStrEntry } from '../types/WarpPoint';
import { ZoneName } from '../types/ZoneMetaMap';
import i18n from '../i18n';
import { useStateWithLS } from '../customHooks/useStateWithLS';

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
    const [searchParams, ] = useSearchParams();
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
    });

    const fbMarkers = freeBuffs.map((fb) => {
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
                name: getLocalText(wp.Data, dataLang),
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
    });

    const habiMarkers = habitats.map((habi) => {
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
    });


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
                const member = (content as MapBoss).data?.members[0];
                const minLv = member?.MinLv ?? 0;
                const maxLv = member?.MaxLv ?? 0;
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
                                            enemy: getLocalText(entry.name, dataLang),
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
                        <div className='mb-2'>
                            <Trans
                                i18nKey={'bossCondition.drops'}
                                defaults="Drops:"
                            />
                            {member?.Drops.filter((drop) => (drop.name)).sort(
                                (x, y) => (y.drop_rate - x.drop_rate)).map(
                                (drop, idx) => (
                                    <div className="flex justify-between items-center" key={`habi-drop-${idx}`}>
                                        <div>
                                            {getLocalText(drop.name, dataLang)}
                                        </div>
                                        <div className="space-x-4">
                                            <span> </span>
                                            <span> </span>
                                        </div>
                                        <div >
                                            {`${Math.floor(drop.drop_rate) / 100}%`}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                );
            } else if (dataType === 'Habitat') {
                return (
                    <div className="overflow-auto max-h-52">
                        {(content as MapHabitat).data?.members.map((member, idx) => {
                            const minLv = member.MinLv ?? 0;
                            const maxLv = member.MaxLv ?? 0;
                            let lvStr = `Lv.${minLv}`;
                            if (maxLv !== minLv) {
                                lvStr += `~${maxLv}`;
                            }
                            return (
                                <div key={`habi-member-${idx}`}>
                                    <div className='font-extrabold' key={`${content.key}_${member.EnemyId}`}>
                                        {getLocalText(member.Name, dataLang)}
                                    </div>
                                    <div className='text-xs mb-1'>{lvStr}</div>
                                    <div className='mb-2'>
                                        {member.Drops.filter((drop) => (drop.name)).sort(
                                            (x, y) => (y.drop_rate - x.drop_rate)).map(
                                            (drop, idx) => (
                                                <div className="flex justify-between items-center" key={`habi-drop-${idx}`}>
                                                    <div>
                                                        {getLocalText(drop.name, dataLang)}
                                                    </div>
                                                    <div className="space-x-4">
                                                        <span> </span>
                                                        <span> </span>
                                                    </div>
                                                    <div >
                                                        {`${Math.floor(drop.drop_rate) / 100}%`}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            );
                                
                        })}
                    </div>
                )
            }
        }
        return (<div className='font-extrabold mb-2'>{marker.markerType}</div>);
    };

    const renderedMarkers = filteredMarkers.map((marker) => {
        return (
            <Marker position={marker.position} icon={marker.icon} key={marker.key} zIndexOffset={marker.zIndex * 1000}>
                <Popup className='w-auto max-w-6xl' maxWidth={500}>
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