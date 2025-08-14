import { Platform, View, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export default function MapService() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDi1uaeP6YMzdW3o-DwT6weS7KkqKv344E&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const mapa = new window.google.maps.Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 12,
        });
        new window.google.maps.Marker({
          position: { lat: -23.5505, lng: -46.6333 },
          map: mapa,
          title: "Estou aqui!",
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  if (Platform.OS === "web") {
    return <div ref={mapRef} style={{ width: "100%", height: "300px" }} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.5505,
          longitude: -46.6333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        <Marker
          coordinate={{ latitude: -23.5505, longitude: -46.6333 }}
          title="São Paulo"
          description="Centro de SP"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: 300 },
  map: { flex: 1 },
});
