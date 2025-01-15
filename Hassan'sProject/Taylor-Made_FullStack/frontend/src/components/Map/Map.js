import { GoogleMap, LoadScript } from '@react-google-maps/api';
import './Map.css';

const Map = () => {
  console.log('API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

  const center = {
    lat: -3.745, // Latitude for map's center
    lng: -38.523, // Longitude for map's center
  };

  const handleLoadError = (error) => {
    console.error('Error loading Google Maps:', error);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onError={handleLoadError}
    >
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
