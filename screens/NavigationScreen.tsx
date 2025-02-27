"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import { Check, SkipForward, Info, AlertTriangle } from "react-native-feather"
import PushNotification from "react-native-push-notification"

const { width, height } = Dimensions.get("window")

// Mock function to simulate getting directions
const getDirections = (origin, destination) => {
  // In a real app, this would call a directions API
  return {
    distance: "5.2 km",
    duration: "12 mins",
    polyline: [
      { latitude: origin.latitude, longitude: origin.longitude },
      { latitude: destination.latitude, longitude: destination.longitude },
    ],
  }
}

export default function NavigationScreen({ route }) {
  const navigation = useNavigation()
  const { stops } = route.params
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [directions, setDirections] = useState(null)
  const [eta, setEta] = useState("")
  const mapRef = useRef(null)

  useEffect(() => {
    // Initialize notifications
    PushNotification.configure({
      onNotification: (notification) => {
        console.log("NOTIFICATION:", notification)
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === "ios",
    })

    // Get initial directions
    updateDirections()
  }, [])

  useEffect(() => {
    // Update directions when current stop changes
    updateDirections()
    // Schedule notification for next stop
    scheduleNotification()
  }, [currentStopIndex])

  const updateDirections = () => {
    if (currentStopIndex < stops.length - 1) {
      const origin = stops[currentStopIndex]
      const destination = stops[currentStopIndex + 1]
      const newDirections = getDirections(origin, destination)
      setDirections(newDirections)
      setEta(newDirections.duration)

      // Center map on the route
      const midLat = (origin.latitude + destination.latitude) / 2
      const midLng = (origin.longitude + destination.longitude) / 2
      mapRef.current?.animateToRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 1.5,
        longitudeDelta: Math.abs(origin.longitude - destination.longitude) * 1.5,
      })
    }
  }

  const scheduleNotification = () => {
    if (currentStopIndex < stops.length - 1) {
      const nextStop = stops[currentStopIndex + 1]
      PushNotification.localNotificationSchedule({
        message: `Upcoming stop: ${nextStop.address}`,
        date: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      })
    }
  }

  const handleCompleteStop = () => {
    if (currentStopIndex < stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1)
    } else {
      // All stops completed
      navigation.navigate("RouteSummary", { stops })
    }
  }

  const handleSkipStop = () => {
    Alert.alert("Skip Stop", "Are you sure you want to skip this stop?", [
      { text: "Cancel", style: "cancel" },
      { text: "Skip", onPress: () => setCurrentStopIndex(currentStopIndex + 1) },
    ])
  }

  const handleStopDetails = () => {
    navigation.navigate("StopDetails", { stop: stops[currentStopIndex] })
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
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
            pinColor={index === currentStopIndex ? "#3b82f6" : "#ef4444"}
          />
        ))}
        {directions && <Polyline coordinates={directions.polyline} strokeColor="#3b82f6" strokeWidth={3} />}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Stop {currentStopIndex + 1} of {stops.length}
          </Text>
          <Text style={styles.etaText}>ETA: {eta}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressText} numberOfLines={2}>
            {stops[currentStopIndex].address}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCompleteStop}>
            <Check stroke="#ffffff" width={24} height={24} />
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSkipStop}>
            <SkipForward stroke="#ffffff" width={24} height={24} />
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleStopDetails}>
            <Info stroke="#ffffff" width={24} height={24} />
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {stops[currentStopIndex].priority === "High" && (
        <View style={styles.priorityAlert}>
          <AlertTriangle stroke="#ffffff" width={24} height={24} />
          <Text style={styles.priorityAlertText}>High Priority Stop</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  map: {
    width: width,
    height: height,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  etaText: {
    fontSize: 16,
    color: "#64748b",
  },
  addressContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 18,
    color: "#0f172a",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  priorityAlert: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  priorityAlertText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
})

