import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "cities";

export default function HistoryScreen({ navigation }) {
  const [cities, setCities] = useState([]);

  const loadCities = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || [];
    setCities(stored.reverse()); // show latest first
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadCities);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Last Viewed Cities</Text>
      {cities.map((c, index) => (
        <TouchableOpacity
          key={index}
          style={styles.cityCard}
          onPress={() => navigation.navigate("CityDetail", { city: c.name })}
        >
          <Text style={styles.cityName}>{c.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F0F8FF", flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#333" },
  cityCard: { 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: "#FFD700", 
    marginBottom: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3
  },
  cityName: { fontSize: 18, fontWeight: "bold", color: "#333" },
});
