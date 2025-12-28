import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentWeather, getForecast } from "../services/weatherApi";

const STORAGE_KEY = "cities";

export default function HomeScreen({ navigation }) {
  const [city, setCity] = useState("Tunis");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const saveCity = async (cityName) => {
    try {
      const cities = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || [];
      const exists = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      if (!exists) {
        cities.push({ name: cityName });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWeather = async () => {
    const current = await getCurrentWeather(city);
    const forecastData = await getForecast(city);
    setWeather(current);
    setForecast(forecastData.list.slice(0, 5));
    saveCity(city);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <View style={{ marginBottom: 10 }}>
        <Button title="Get Weather" onPress={fetchWeather} color="#1E90FF"/>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Button
          title="View History"
          onPress={() => navigation.navigate("History")}
          color="#32CD32"
        />
      </View>

      {weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.info}>Temperature: {weather.main.temp}°C</Text>
          <Text style={styles.info}>Condition: {weather.weather[0].description}</Text>
          <Text style={styles.info}>Humidity: {weather.main.humidity}%</Text>
        </View>
      )}

      {forecast.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>Forecast (Next 5 periods)</Text>
          {forecast.map((f, index) => (
            <View key={index} style={styles.forecastCard}>
              <Text>{f.dt_txt}</Text>
              <Text>{f.main.temp}°C - {f.weather[0].description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F0F8FF", flex: 1 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8, borderColor: "#ccc", backgroundColor: "#fff" },
  weatherCard: { 
    marginTop: 20, 
    padding: 20, 
    borderRadius: 10, 
    backgroundColor: "#87CEEB", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 3, 
    elevation: 5 
  },
  cityName: { fontSize: 22, fontWeight: "bold", marginBottom: 5, color: "#fff" },
  info: { fontSize: 16, color: "#fff" },
  forecastCard: { 
    marginTop: 10, 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: "#B0E0E6",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
    elevation: 3 
  },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#333" },
});
