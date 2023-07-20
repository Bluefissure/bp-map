import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import crossfilter from 'crossfilter2';
import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';

import bgConfigJson from '../assets/data/bgconfig.json';
import { zoneMetaMap } from './ZoneMetaMap';
import { MapDrawer } from './MapDrawer';

import { ZoneConfig } from '../types/ZoneConfig';
import { MapMarker, MapTreasure, MapContent, MapFreeBuff, MapWarpPoint } from '../types/MapMarker';
import { ContentType } from './MapDrawer';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
} from './Icons';
import { RelativeLocation } from '../types/GatherPoint';


export const MyMapContainer = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const zoneIdParam = searchParams.get('zone_id');
    const [zoneId, setZoneId] = useState(zoneIdParam ?? 'fld001');
    const [drawerOpen, setDrawerOpen] = useState(false);

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
        let gatherType = 'Gathering - Mineral';
        const onlyOneTrasure = (gp.Data.lot_rate.length === 1) && (gp.Data.lot_rate[0].rate === 10000);
        let icon = onlyOneTrasure ? MineralGIcon : MineralIcon;
        if (gp.GatherPointTag.startsWith('P')) {
            gatherType = 'Gathering - Plant';
            icon = onlyOneTrasure ? PlantGIcon : PlantIcon;
        } else if (gp.GatherPointTag.startsWith('A')) {
            gatherType = 'Gathering - Aquatic';
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
        let markerType = 'Treasure Box';
        let icon = TreasureIcon;
        if (tr.Data.lot_rate.length > 0) {
            if (tr.Data.lot_rate[0].reward_type == 15) {
                markerType += ' - Liquid Memory';
                icon = TreasureLMIcon;
            } else if (tr.Data.lot_rate[0].reward_type == 28) {
                markerType += ' - Adventure Board';
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
        const gatherType = 'Free Buff';
        const icon = FreeBuffIcon;
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
            icon,
            content: freebuffs,
        } as MapMarker;
    });

    const wpMarkers = warpPoints.map((wp) => {
        const position = calcMapPosition(wp.RelativeLocation, zoneConfig, mapSize);
        const markerType = 'Warp Point';
        const icon = WarpPointIcon;
        return {
            key: wp.WarpPointKey,
            dataType: 'WarpPoint',
            zIndex: 10,
            markerType: markerType,
            position,
            icon,
            content: {
                type: 'WarpPoint',
                key: wp.WarpPointKey,
                name: wp.Data.ja_JP,
            } as MapWarpPoint,
        } as MapMarker;
    });


    const markers = [...gpMarkers, ...trMarkers, ...fbMarkers, ...wpMarkers] as MapMarker[];
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
    const markerContentToType = useMemo(() => {
        const tempDict = {} as {[key: string]: string};
        markers.forEach((marker) => {
            const content = marker.content;
            if (Array.isArray(content)) {
                content.forEach((ele) => {
                    tempDict[ele.name] = marker.markerType;
                })
                return content.map((ele) => (ele.name));
            } else {
                if (marker.dataType === 'WarpPoint') {
                    tempDict[(marker.content as MapWarpPoint).name] = marker.markerType;
                }
            }
        })
        return tempDict;
    }, [cf]);
    const contentDim = useMemo(() => (cf.dimension((marker) => {
        const content = marker.content;
        if (Array.isArray(content)) {
            return content.map((ele) => (ele.name));
        } else {
            if (marker.dataType === 'WarpPoint') {
                return [(marker.content as MapWarpPoint).name];
            }
        }
        return [];
    }, true)), [cf]);
    const [filteredMarkers, setFilteredMarkers] = useState(cf.allFiltered());
    const [contentDimGroupAll, setContentDimGroupAll] = useState(
        contentDim.group().all().map(
            (x) => ({
                key: x.key as string,
                value: x.value as number,
                type: markerContentToType[x.key as string] ?? 'Unknown',
            } as ContentType)
        ));

    useEffect(() => {
        setFilteredMarkers(cf.allFiltered());
    }, [zoneId]);


    cf.onChange(() => {
        setFilteredMarkers(cf.allFiltered());
        setContentDimGroupAll(contentDim.group().all().map(
            (x) => ({
                key: x.key as string,
                value: x.value as number,
                type: markerContentToType[x.key as string] ?? 'Unknown',
            } as ContentType)
        ));
    });

    const markerContentRender = (dataType: string, content: MapContent) => {
        if (Array.isArray(content)) {
            if (['GatherPoint', 'TreasureBox', 'FreeBuff'].indexOf(dataType) !== -1) {
                return content.map((tr)=> (
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
                ));
            }
        } else {
            if (dataType === 'WarpPoint') {
                return (
                    <div>
                        {content.name}
                    </div>
                );
            }
        }
        return '';
    };

    const renderedMarkers = filteredMarkers.map((marker) => {
        return (
            <Marker position={marker.position} icon={marker.icon} key={marker.key} zIndexOffset={marker.zIndex * 1000}>
                <Popup className='w-auto max-w-6xl'>
                    <div className='font-extrabold mb-2'>{marker.markerType}</div>
                    {markerContentRender(marker.dataType, marker.content)}
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