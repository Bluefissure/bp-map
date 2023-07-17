import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';
import { MineralIcon, PlantIcon, AquaticIcon, MineralGIcon, PlantGIcon, AquaticGIcon } from './Icons';
import { zoneMetaMap } from './ZoneMetaMap';
import { ZoneConfig } from '../types/ZoneConfig';
import bgConfigJson from '../assets/data/bgconfig.json';

export const MyMapContainer = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const zoneIdParam = searchParams.get('zone_id');
    const [zoneId, setZoneId] = useState(zoneIdParam ?? 'fld001');

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
    const bgConfig: {
        [key: string]: ZoneConfig
    } = bgConfigJson;
    const zoneConfig = bgConfig[zoneTopKey];
    const markers = gatherPoints.map((gp) => {
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
        return (<Marker position={position} icon={icon} key={gp.GatherPointKey}>
            <Popup className='w-auto max-w-6xl'>
                <div className='font-extrabold mb-2'>{gatherType}</div>
                {treasures}
            </Popup>
        </Marker>)
    })

    const center = new LatLng(mapSize.lat / 2, mapSize.lng / 2);
    return (<MapContainer
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
        {markers}
    </MapContainer>);
}