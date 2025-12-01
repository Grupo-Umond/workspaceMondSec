import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const StatusModal = ({ visible, onClose, type, message }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          
          <MaterialIcons
            name={type === "success" ? "check-circle" : "error"}
            size={50}
            color={type === "success" ? "#2ecc71" : "#e74c3c"}
          />

          <Text style={styles.message}>{message}</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#12577B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default StatusModal;