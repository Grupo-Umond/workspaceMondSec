import React, { useState, useEffect } from "react";
import { Pressable, View, Text, TextInput, Modal, StyleSheet } from "react-native";
import { EnderecoService } from "../../../services/EnderecoService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const OcorrenciaScreen = ({ navigation }) => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [lengthNumber, setLengthNumber] = useState(0);
  const [informacao, setInformacao] = useState(false);
  const [indice, setIndice] = useState(null);

  useEffect(() => {
    async function buscarOcorrencia() {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.log("Token não recebido.");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/ocorrencia/procurar",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        if (!data || data.length === 0) {
          console.log("Nenhuma ocorrência encontrada.");
          return;
        }

        const ocorrenciasComEndereco = await Promise.all(
          data.map(async (ocorrencia) => {
            try {
              const endereco = await EnderecoService(
                ocorrencia.latitude,
                ocorrencia.longitude
              );
              return {
                ...ocorrencia,
                rua: endereco.road || "Rua não encontrada",
                cidade: endereco.city || "Cidade não encontrada",
              };
            } catch (e) {
              console.log("Erro ao buscar endereço:", e);
              return {
                ...ocorrencia,
                rua: "Indefinido",
                cidade: "Indefinido",
              };
            }
          })
        );

        setOcorrencias(ocorrenciasComEndereco);
        setLengthNumber(ocorrenciasComEndereco.length);
      } catch (err) {
        console.log("Erro ao buscar ocorrências:", err);
      }
    }

    buscarOcorrencia();
  }, []);

  const mostrarModal = (index) => {
    setIndice(index);
    setInformacao(true);
  };

  const desaparecer = async () => {
    setInformacao(false);
    navigation.navigate("Home");
  };

  return (
    <View>
      <View>
        <Pressable onPress={() => navigation.navigate("Menu")}>
          <Text>Back</Text>
        </Pressable>
        <Text>Seu Histórico</Text>
        <Pressable onPress={() => navigation.navigate("Configuracao")}>
          <Text>Config</Text>
        </Pressable>
      </View>

      <TextInput />

      <View>
        <Text>Total de Ocorrências: {lengthNumber}</Text>
        <Pressable onPress={() => navigation.navigate("Registrar")}>
          <Text>+</Text>
        </Pressable>

        {ocorrencias.map((ocorrencia, index) => (
          <View key={index}>
            <Text>{ocorrencia.titulo}</Text>
            <Text>{ocorrencia.rua}</Text>
            <Text>{ocorrencia.cidade}</Text>
            <Text>{ocorrencia.data}</Text>
            <Pressable onPress={() => mostrarModal(index)}>
              <Text>Ver detalhes</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Modal animationType="slide" visible={informacao} transparent>
        {indice != null && ocorrencias[indice] && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes</Text>
              <Text style={styles.modalText}>
                {ocorrencias[indice].titulo}
              </Text>
              <Text style={styles.modalText}>
                {ocorrencias[indice].rua}
              </Text>
              <Text style={styles.modalText}>
                {ocorrencias[indice].cidade}
              </Text>
              <Text style={styles.modalText}>
                {ocorrencias[indice].data}
              </Text>
              <Text style={styles.modalText}>
                {ocorrencias[indice].descricao}
              </Text>
              <Pressable onPress={desaparecer}>
                <Text style={styles.modalButton}>Ver no Mapa</Text>
              </Pressable>
              <Pressable onPress={() => setInformacao(false)}>
                <Text style={styles.modalButton}>Favoritar</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#003366",
  },
  modalText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalButton: {
    color: "#007BFF",
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default OcorrenciaScreen;
