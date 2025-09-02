
import { Platform, View, StyleSheet } from "react-native";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";


const MapaService = forwardRef((props, ref) => {
  const mapRef = useRef(null);
  const googleMap = useRef(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBojQS_cK54zyvBGj9ZIaCnZ4eCySSRrTE&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {

        googleMap.current = new window.google.maps.Map(mapRef.current, {

          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 14,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f5" }]
            },
            {
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#616161" }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#f5f5f5" }]
            },
            {
              "featureType": "administrative.land_parcel",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#bdbdbd" }]
            },
            {
              "featureType": "administrative.neighborhood",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{ "color": "#eeeeee" }]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#757575" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{ "color": "#e5e5e5" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#9e9e9e" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#757575" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [{ "color": "#dadada" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#616161" }]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#9e9e9e" }]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [{ "color": "#e5e5e5" }]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [{ "color": "#eeeeee" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#c9c9c9" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#9e9e9e" }]
            }
          ]
        });


        const locations = [
          { lat: -23.5489, lng: -46.6388, title: "Shopping Paulista" },
          { lat: -23.5520, lng: -46.6315, title: "Teatro Municipal" },
          { lat: -23.5456, lng: -46.6340, title: "Parque da República" },
          { lat: -23.5550, lng: -46.6410, title: "Rua Augusta" },
          { lat: -23.5470, lng: -46.6440, title: "Avenida Paulista" }
        ];

        locations.forEach(location => {
          new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title,
            icon: {
              url: "data:image/svg+xml;base64," + btoa(`
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="#12577B" stroke="white" stroke-width="2"/>
                  <circle cx="10" cy="10" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(20, 20)
            }
          });
        });

      };
      document.body.appendChild(script);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    centralizarNoEndereco(lat, lng) {
      if (Platform.OS === "web" && googleMap.current) {
        googleMap.current.setCenter({ lat, lng });
        new window.google.maps.Marker({
          position: { lat, lng },
          map: googleMap.current,
        });
      }
    },
  }));

  if (Platform.OS === "web") {

    return (
      <div style={styles.webContainer}>
        <div ref={mapRef} style={styles.webMap} />
      </div>
    );
  }



const styles = StyleSheet.create({
  container: { 
    width: "100%", 
    height: "100%",
    backgroundColor: "#f0f8ff"
  },
  webContainer: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  webMap: {
    width: '100%',
    height: '100%', 
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  },
  nativePlaceholder: {
    flex: 1,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  nativeOverlayText: {
    fontSize: 14,
    color: '#666'
  }
});
