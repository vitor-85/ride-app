import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [40, 40]
});


function FitBounds({ route }) {
  const map = useMap();

  useEffect(() => {
    if (!route || route.length < 2) return;

    map.fitBounds(route);
  }, [route]);

  return null;
}

function Map({ route, hasCard, moving }) {
  const [carPosition, setCarPosition] = useState(null);

useEffect(() => {
  if (!route) return;

  if (!moving) {
    setCarPosition(null);
    return;
  }

  let i = 0;

  setCarPosition(route[0]);

  const interval = setInterval(() => {

    if (i >= route.length - 1) {
      clearInterval(interval);
      return;
    }

   setCarPosition(route[i]);

    i++;

  }, 80);

  return () => clearInterval(interval);

}, [route, moving]);

  if (!route || route.length < 2) return null;

  return (
  <MapContainer
  center={ route[0]}
  zoom={13}
  style={{
    height: hasCard ? "60%" : "100%",
    width: "100%",
    zIndex: 1
  }}
>
      <TileLayer
        attribution='© OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

     
      <FitBounds route={route} />

   
      <Marker position={route[0]} />

   
      <Marker position={route[route.length - 1]} />

  
      <Polyline
        positions={route}
        pathOptions={{
          color: "#000",
          weight: 6
        }}
      />

      
{carPosition && (
  <Marker
    position={carPosition}
    icon={carIcon}
  />
)}
    </MapContainer>
  );
}

export default Map;