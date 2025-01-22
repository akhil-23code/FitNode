import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';

const CourseMap: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [gyms, setGyms] = useState<any[]>([]);

  const fetchNearbyGyms = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&dedupe=1&q=gym&addressdetails=1&limit=10&viewbox=${lon - 0.1},${lat + 0.1},${lon + 0.1},${lat - 0.1}`
      );
      setGyms(response.data);
    } catch (error) {
      console.error('Error fetching nearby gyms:', error);
      alert('Could not fetch gyms. Please try again later.');
    }
  };

  useEffect(() => {
    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        fetchNearbyGyms(latitude, longitude);
      },
      (error) => {
        console.error('Error getting user location:', error);
        alert('Please enable location services to find gyms near you.');
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Find Gyms Near You</h1>

      {currentLocation ? (
        <MapContainer
          center={currentLocation}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
          className="rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />

          <Marker position={currentLocation}>
            <Popup>Your Current Location</Popup>
          </Marker>

          {gyms.map((gym, index) => (
            <Marker
              key={index}
              position={[parseFloat(gym.lat), parseFloat(gym.lon)]}
            >
              <Popup>
                <strong>{gym.display_name}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p className="text-center text-lg">Loading map...</p>
      )}
    </div>
  );
};

export default CourseMap;
