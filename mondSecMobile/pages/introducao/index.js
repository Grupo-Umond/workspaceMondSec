import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Bem Vindo!",
    subtitle: "Somos a MondSec e sempre oferecemos os melhores caminhos para as decisões certas!",
    image: require("../../assets/ImagensIntroducao/MondSecLogo.png")
  },
  {
    id: "2",
    title: "Use com responsabilidade",
    subtitle: "Disponibilizamos as melhores ferramentas a todos, por isso coopere para que todos tenham as melhores experiências possíveis!",
    image: require("../../assets/ImagensIntroducao/Responsabilidade.png")
  },
  {
    id: "3",
    title: "Vamos começar!",
    subtitle: "O seu mundo seguro inicia aqui!",
    image: require("../../assets/ImagensIntroducao/Rotas.png")
  }
];

export default function Introducao({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef(null);

  function handleNext() {
    if (currentIndex < slides.length - 1) {
      listRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("Login");
    }
  }

  function skip() {
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Indicadores */}
      <View style={styles.indicatorsWrapper}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: currentIndex === i ? 1 : 0.3 }]}
          />
        ))}
      </View>

      {/* Botões */}
      <View style={styles.bottomButtons}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={skip}>
            <Text style={styles.skip}>Pular Introdução</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startButton} onPress={handleNext}>
            <Text style={styles.startText}>Começar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    width: "90%",
    fontSize: 20,
    textAlign: "center",
    color: "#555",
  },
  indicatorsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#002248",
    marginHorizontal: 5,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    paddingLeft: "25%",
    paddingRight: "25%",
  },
  skip: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#5A0CED",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});