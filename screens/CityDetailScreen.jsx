import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getCurrentWeather, getForecast } from "../services/weatherApi";

export default function CityDetailScreen({ route }) {
  const { city } = route.params;
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const current = await getCurrentWeather(city);
      const forecastData = await getForecast(city);
      setWeather(current);
      setForecast(forecastData.list.slice(0, 5));
    };
    fetchData();
  }, [city]);

  return (
    <ScrollView style={styles.container}>
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
  weatherCard: { 
    marginTop: 20, 
    padding: 20, 
    borderRadius: 12, 
    backgroundColor: "#87CEFA", 
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
    backgroundColor: "#ADD8E6",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2, 
    elevation: 3 
  },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#333" },
});
