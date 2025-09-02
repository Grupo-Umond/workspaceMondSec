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
          zoom: 12,
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
    return <div ref={mapRef} style={{ width: "100%", height: 300 }} />;
  }

  return <View style={styles.container}>{/* Mobile MapView aqui */}</View>;
});

export default MapaService;

const styles = StyleSheet.create({
  container: { width: "100%", height: 300 },
});
