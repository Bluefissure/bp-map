import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';
import { zoneMetaMap } from './ZoneMetaMap';
import { ZoneConfig } from '../types/ZoneConfig';
import bgConfigJson from '../assets/data/bgconfig.json';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { MapDrawer } from './MapDrawer';

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
} from './Icons';



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
    const gatherPoints = zoneMetaMap[zoneId].gatherPoints;
    const treasureBoxes = zoneMetaMap[zoneId].treasureBoxes;
    const bgConfig: {
        [key: string]: ZoneConfig
    } = bgConfigJson;
    const zoneConfig = bgConfig[zoneTopKey];
    
    const gpMarkers = gatherPoints.map((gp) => {
        const worldX = gp.RelativeLocation.X;
        const worldY = gp.RelativeLocation.Y;
        const mapLat = (zoneConfig.CaptureSize.Y - (worldY - zoneConfig.CapturePosition.Y)) / zoneConfig.CaptureSize.Y * mapSize.lat;
        const mapLng = (worldX - zoneConfig.CapturePosition.X) / zoneConfig.CaptureSize.X * mapSize.lng;
        const position = new LatLng(mapLat, mapLng);
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
            (item, idx) => (
                <div className="flex justify-between items-center" key={`item-treasure-${idx}`}>
                    <div >
                        {item.text.ja_JP}
                    </div>
                    <div className="space-x-4">
                        <span> </span>
                        <span> </span>
                    </div>
                    <div >
                        {`${Math.floor(item.rate / 100)}%`}
                    </div>
                </div>));
        return (
            <Marker position={position} icon={icon} key={gp.GatherPointKey}>
                <Popup className='w-auto max-w-6xl'>
                    <div className='font-extrabold mb-2'>{gatherType}</div>
                    {treasures}
                </Popup>
            </Marker>
        );
    })

    const trMarkers = treasureBoxes?.map((tr) => {
        const worldX = tr.RelativeLocation.X;
        const worldY = tr.RelativeLocation.Y;
        const mapLat = (zoneConfig.CaptureSize.Y - (worldY - zoneConfig.CapturePosition.Y)) / zoneConfig.CaptureSize.Y * mapSize.lat;
        const mapLng = (worldX - zoneConfig.CapturePosition.X) / zoneConfig.CaptureSize.X * mapSize.lng;
        const position = new LatLng(mapLat, mapLng);
        let gatherType = 'Treasure Box';
        let icon = TreasureIcon;
        if (tr.Data.lot_rate.length > 0) {
            if (tr.Data.lot_rate[0].reward_type == 15) {
                gatherType += ' - Liquid Memory';
                icon = TreasureLMIcon;
            } else if (tr.Data.lot_rate[0].reward_type == 28) {
                gatherType += ' - Adventure Board';
                icon = TreasureABIcons[tr.Data.lot_rate[0].reward_master_id] ?? TreasureABIcons['_'];
            }
        }
        // const onlyOneTrasure = (tr.Data.lot_rate.length === 1) && (tr.Data.lot_rate[0].rate === 10000);
        const treasures = tr.Data.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item, idx) => (
                <div className="flex justify-between items-center" key={`item-treasure-${idx}`}>
                    <div >
                        {item.text.ja_JP}
                    </div>
                    <div className="space-x-4">
                        <span> </span>
                        <span> </span>
                    </div>
                    <div >
                        {`${Math.floor(item.rate / 100)}%`}
                    </div>
                </div>));
        return (
            <Marker position={position} icon={icon} key={tr.TreasureBoxKey}>
                <Popup className='w-auto max-w-6xl'>
                    <div className='font-extrabold mb-2'>{gatherType}</div>
                    {treasures}
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
                // edge="end"
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
                {gpMarkers}
                {trMarkers}
            </MapContainer>

            <MapDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={(value: boolean) => {setDrawerOpen(value)}}
                setZoneId={(zId: string) => {setZoneId(zId)}}
            />
            
        </Box>
    );
}