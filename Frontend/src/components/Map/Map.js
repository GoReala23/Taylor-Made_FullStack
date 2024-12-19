import { GoogleMap, LoadScript } from '@react-google-maps/api';
import './Map.css';

const Map = () => {
  const center = {
    lat: -3.745, // Latitude for map's center
    lng: -38.523, // Longitude for map's center
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        className='map__container'
        mapContainerClassName='map__container'
        center={center}
        zoom={10}
      >
        {/* Add markers or other map elements here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
