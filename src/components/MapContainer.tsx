import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';
import { MineralIcon, PlantIcon, AquaticIcon, MineralGIcon, PlantGIcon, AquaticGIcon } from './Icons';
import mapFld001 from '../assets/map/UI_MapFld001.png';
import gatherPoints from '../assets/data/fld001/GatherPoints.json';
import bgConfig from '../assets/data/bgconfig.json';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';


// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     iconSize: [24,36],
//     iconAnchor: [12,36],
//     popupAnchor: [0, -36],
//     shadowUrl: iconShadow
// });

// L.Marker.prototype.options.icon = DefaultIcon;

export const MyMapContainer = () => {
    const mapSize = new LatLng(216, 380);
    const bounds = new LatLngBounds(
        new LatLng(0, 0),
        mapSize,
    );
    const fld001Meta = bgConfig.fld001_Top;
    const GPList = [...gatherPoints];
    const markers = GPList.map((entry) => {
        const worldX = entry.RelativeLocation.X;
        const worldY = entry.RelativeLocation.Y;
        const mapLat = (fld001Meta.CaptureSize.Y - (worldY - fld001Meta.CapturePosition.Y)) / fld001Meta.CaptureSize.Y * mapSize.lat;
        const mapLng = (worldX - fld001Meta.CapturePosition.X) / fld001Meta.CaptureSize.X * mapSize.lng;
        const position = new LatLng(mapLat, mapLng);
        let gatherType = 'Gathering - Mineral';
        const onlyOneTrasure = (entry.Data.lot_rate.length === 1) && (entry.Data.lot_rate[0].rate === 10000);
        let icon = onlyOneTrasure ? MineralGIcon : MineralIcon;
        if (entry.GatherPointTag.startsWith('P')) {
            gatherType = 'Gathering - Plant';
            icon = onlyOneTrasure ? PlantGIcon : PlantIcon;
        } else if (entry.GatherPointTag.startsWith('A')) {
            gatherType = 'Gathering - Aquatic';
            icon = onlyOneTrasure ? AquaticGIcon : AquaticIcon;
        }
        const treasures = entry.Data.lot_rate.sort((x, y) => (y.rate - x.rate)).map(
            (item) => (
                <div className="flow-root">
                    <div className="float-left">
                        {item.text.ja_JP}
                    </div>
                    <div className="float-right">
                        {`${Math.floor(item.rate / 100)}%`}
                    </div>
                </div>));
        return (<Marker position={position} icon={icon} key={entry.GatherPointKey}>
            <Popup className='w-52 max-w-6xl'>
                <div className='font-extrabold mb-2'>{gatherType}</div>
                {treasures}
            </Popup>
        </Marker>)
    })

    const center = new LatLng(mapSize.lat / 2, mapSize.lng / 2);
    return (<MapContainer center={center} zoom={3} minZoom={2} maxZoom={6} scrollWheelZoom={true} crs={L.CRS.Simple}>
        <ImageOverlay
            attribution='&copy;BANDAI NAMCO Online Inc. &copy; BANDAI NAMCO Studios Inc.'
            url={mapFld001}
            bounds={bounds}
        />
        {markers}
    </MapContainer>);
}