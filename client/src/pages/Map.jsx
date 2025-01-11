// MapComponent.jsx
import React, { useEffect } from 'react';

const MapComponent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD0iiGzKufoxMTYbqt_aX2m6BQsDgkhoOE&libraries=places";
    script.async = true;
    script.onload = () => initialise();
    document.body.appendChild(script);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of Earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    const initialise = () => {
      const customLocation = { lat: 13.0108, lng: 74.7943 };

      const map = new google.maps.Map(document.getElementById('map'), {
        center: customLocation,
        zoom: 15,
      });

      new google.maps.Marker({
        position: customLocation,
        map: map,
        title: "Custom Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom location marker
      });

      const input = document.getElementById('searchTextField');
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
      });

      const request = {
        location: customLocation,
        radius: '2000', // 2 km
        type: ['hospital'],
      };

      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {
            const distance = calculateDistance(
              customLocation.lat,
              customLocation.lng,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );

            const hospitalMarker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              title: place.name,
              icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Hospital marker
            });

            const infowindow = new google.maps.InfoWindow({
              content: `<div><strong>${place.name}</strong><br>Distance: ${distance.toFixed(2)} km</div>`,
            });

            // Show infowindow on hover
            hospitalMarker.addListener('mouseover', () => {
              infowindow.open(map, hospitalMarker);
            });

            // Hide infowindow when the mouse leaves the marker
            hospitalMarker.addListener('mouseout', () => {
              infowindow.close();
            });
          });
        }
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (

    <div className="container mx-auto px-4 py-6 bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:translate-y-1 hover:shadow-lg">
      <input
        id="searchTextField"
        type="text"
        placeholder="Search nearby hospitals"
        className="w-full p-3 text-base border-2 border-gray-300 rounded-md mb-6 outline-none transition-all duration-300 focus:border-blue-300"
      />
      <div
        id="map"
        style={{ width: '100%', height: '500px', borderRadius: '10px' }}
        className="transition-shadow duration-300 hover:shadow-xl"
      />
    </div>
  );
};

export default MapComponent;
