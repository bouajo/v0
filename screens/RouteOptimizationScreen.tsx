"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import MapView, { Marker, Polyline } from "react-native-maps"
import { ArrowLeft, Navigation, Edit2, Check } from "react-native-feather"
import DraggableFlatList from "react-native-draggable-flatlist"

const { width, height } = Dimensions.get("window")

// Mock function to simulate route optimization
const optimizeRoute = (stops, preference) => {
  // In a real app, this would call an API or use an algorithm to optimize the route
  return stops
}

// Mock function to get route polyline
const getRoutePolyline = (stops) => {
  // In a real app, this would call a directions API to get the actual route
  return stops.map((stop) => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }))
}

export default function RouteOptimizationScreen({ route }) {
  const navigation = useNavigation()
  const { routeTitle, stops: initialStops } = route.params

  const [stops, setStops] = useState(initialStops)
  const [optimizationPreference, setOptimizationPreference] = useState("fastest")
  const [routePolyline, setRoutePolyline] = useState([])

  useEffect(() => {
    const optimizedStops = optimizeRoute(stops, optimizationPreference)
    setStops(optimizedStops)
    setRoutePolyline(getRoutePolyline(optimizedStops))
  }, [stops, optimizationPreference])

  const handleReorderStops = (newStops) => {
    setStops(newStops)
    setRoutePolyline(getRoutePolyline(newStops))
  }

  const handleStartRoute = () => {
    navigation.navigate("Navigation", { stops })
  }

  const handleEditStops = () => {
    navigation.goBack()
  }

  const handleConfirmRoute = () => {
    Alert.alert("Route Confirmed", "Your optimized route has been saved.")
    navigation.navigate("Dashboard")
  }

  const renderStopItem = ({ item, drag, isActive }) => (
    <TouchableOpacity
      style={[styles.stopItem, { backgroundColor: isActive ? "#e2e8f0" : "#ffffff" }]}
      onLongPress={drag}
    >
      <Text style={styles.stopAddress} numberOfLines={1}>
        {item.address}
      </Text>
      {item.timeWindow.from && item.timeWindow.to && (
        <Text style={styles.stopTime}>
          {item.timeWindow.from} - {item.timeWindow.to}
        </Text>
      )}
      <View
        style={[
          styles.priorityBadge,
          {
            backgroundColor: item.priority === "High" ? "#ef4444" : item.priority === "Normal" ? "#f59e0b" : "#10b981",
          },
        ]}
      >
        <Text style={styles.priorityText}>{item.priority}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Optimization</Text>
        <View style={{ width: 24 }} />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: stops[0].latitude,
          longitude: stops[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {stops.map((stop, index) => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={`Stop ${index + 1}`}
            description={stop.address}
          />
        ))}
        <Polyline coordinates={routePolyline} strokeColor="#3b82f6" strokeWidth={3} />
      </MapView>

      <View style={styles.optimizationSettings}>
        <Text style={styles.settingsLabel}>Optimization Preference:</Text>
        <View style={styles.settingsOptions}>
          {["fastest", "shortest", "balanced"].map((pref) => (
            <TouchableOpacity
              key={pref}
              style={[styles.settingsOption, optimizationPreference === pref && styles.settingsOptionActive]}
              onPress={() => setOptimizationPreference(pref)}
            >
              <Text
                style={[styles.settingsOptionText, optimizationPreference === pref && styles.settingsOptionTextActive]}
              >
                {pref.charAt(0).toUpperCase() + pref.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.stopsContainer}>
        <Text style={styles.stopsTitle}>Stops ({stops.length})</Text>
        <DraggableFlatList
          data={stops}
          renderItem={renderStopItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => handleReorderStops(data)}
        />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditStops}>
          <Edit2 stroke="#ffffff" width={20} height={20} />
          <Text style={styles.buttonText}>Edit Stops</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleStartRoute}>
          <Navigation stroke="#ffffff" width={20} height={20} />
          <Text style={styles.buttonText}>Start Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirmRoute}>
          <Check stroke="#ffffff" width={20} height={20} />
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  map: {
    width: width,
    height: height * 0.3,
  },
  optimizationSettings: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
  },
  settingsOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  settingsOptionActive: {
    backgroundColor: "#3b82f6",
  },
  settingsOptionText: {
    color: "#64748b",
    fontWeight: "500",
  },
  settingsOptionTextActive: {
    color: "#ffffff",
  },
  stopsContainer: {
    flex: 1,
    padding: 16,
  },
  stopsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0f172a",
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stopAddress: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  stopTime: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#64748b",
  },
  startButton: {
    backgroundColor: "#3b82f6",
  },
  confirmButton: {
    backgroundColor: "#10b981",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
})

