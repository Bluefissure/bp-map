import { MapContainer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds} from 'leaflet';
import * as L from 'leaflet';
import { MineralIcon, PlantIcon, AquaticIcon } from './Icons';
import mapFld001 from '../assets/maps/UI_MapFld001.png';
import fld001_W_PU from '../assets/data/fld/fld001/fld001_W_PU_output.json';
import fld001_E_PU from '../assets/data/fld/fld001/fld001_E_PU_output.json';
import fld001_S_PU from '../assets/data/fld/fld001/fld001_S_PU_output.json';
import fld001_N_PU from '../assets/data/fld/fld001/fld001_N_PU_output.json';
import fld001_META from '../assets/data/fld/fld001/meta.json';
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
    const fld001Meta = fld001_META;
    const GPList = [...fld001_W_PU, ...fld001_E_PU, ...fld001_N_PU, ...fld001_S_PU];
    const markers = GPList.map((entry) => {
        const worldX = entry.RelativeLocation.X;
        const worldY = entry.RelativeLocation.Y;
        const mapLat = (fld001Meta.CaptureSize.Y - (worldY - fld001Meta.CapturePosition.Y)) / fld001Meta.CaptureSize.Y * mapSize.lat;
        const mapLng = (worldX - fld001Meta.CapturePosition.X) / fld001Meta.CaptureSize.X * mapSize.lng;
        const position = new LatLng(mapLat, mapLng);
        let icon = MineralIcon;
        if (entry.GatherPointTag.startsWith('P')) {
            icon = PlantIcon;
        } else if (entry.GatherPointTag.startsWith('A')) {
            icon = AquaticIcon;
        }
        return (<Marker position={position} icon={icon} key={entry.GatherPointKey}>
              <Popup>
                哈哈😄 <br /> 啥也没有！啥也没有！啥也没有！啥也没有！<br /> <div style={{fontSize:5}}>大妈：没带还是没写？！</div>
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