import './App.css';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import { LatLng, LatLngBounds, LatLngExpression} from 'leaflet';
import * as L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

import mapFld001 from './assets/maps/UI_MapFld001.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


let DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [24,36],
    iconAnchor: [12,36],
    popupAnchor: [0, -36],
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;
const MyMapContainer = () => {
    // L.Map
    const bounds = new LatLngBounds(
        new LatLng(-216/2, 384/2),
        new LatLng(216/2, -384/2),

    );
    const position = new LatLng(0, 0);
    return (<MapContainer center={position} zoom={5} scrollWheelZoom={true} crs={L.CRS.Simple}>
    <ImageOverlay
      attribution='&copy;BANDAI NAMCO Online Inc. &copy; BANDAI NAMCO Studios Inc.'
      url={mapFld001}
      bounds={bounds}
    />
    <Marker position={position}>
      <Popup>
        Three pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>);
}

function App() {
  return (
    <div className="App">
        <MyMapContainer/>
    </div>
  );
}

export default App;
