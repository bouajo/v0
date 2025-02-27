"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Mic, Camera, Upload, Plus, MapPin, Clock, Package, Flag } from "react-native-feather"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

// Mock function for voice input
const startVoiceInput = () => {
  Alert.alert("Voice Input", "Voice input functionality would be implemented here.")
}

// Mock function for barcode scanning
const startBarcodeScanning = () => {
  Alert.alert("Barcode Scanning", "Barcode scanning functionality would be implemented here.")
}

// Mock function for file import
const importStops = () => {
  Alert.alert("Import Stops", "File import functionality would be implemented here.")
}

const PriorityBadge = ({ priority }) => {
  const color = priority === "High" ? "#ef4444" : priority === "Normal" ? "#f59e0b" : "#10b981"
  return (
    <View style={[styles.priorityBadge, { backgroundColor: color }]}>
      <Text style={styles.priorityText}>{priority}</Text>
    </View>
  )
}

export default function RouteCreationScreen() {
  const navigation = useNavigation()
  const [routeTitle, setRouteTitle] = useState("")
  const [stops, setStops] = useState([])
  const scrollViewRef = useRef()

  const addStop = (address) => {
    setStops([
      ...stops,
      {
        id: Date.now().toString(),
        address,
        timeWindow: { from: "", to: "" },
        priority: "Normal",
        packageDetails: "",
      },
    ])
    setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100)
  }

  const updateStop = (id, field, value) => {
    setStops(stops.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop)))
  }

  const removeStop = (id) => {
    setStops(stops.filter((stop) => stop.id !== id))
  }

  const handleOptimizeRoute = () => {
    if (routeTitle.trim() === "") {
      Alert.alert("Error", "Please enter a route title.")
      return
    }
    if (stops.length < 2) {
      Alert.alert("Error", "Please add at least two stops to optimize the route.")
      return
    }
    navigation.navigate("RouteOptimization", { routeTitle, stops })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft stroke="#0f172a" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Route</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.routeTitleInput}
            placeholder="Enter Route Title"
            value={routeTitle}
            onChangeText={setRouteTitle}
          />

          <View style={styles.stopInputContainer}>
            <GooglePlacesAutocomplete
              placeholder="Enter stop address"
              onPress={(data, details = null) => addStop(data.description)}
              query={{
                key: "YOUR_GOOGLE_PLACES_API_KEY",
                language: "en",
              }}
              styles={{
                textInput: styles.addressInput,
                listView: styles.autocompleteList,
              }}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.actionButton} onPress={startVoiceInput}>
                <Mic stroke="#3b82f6" width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={startBarcodeScanning}>
                <Camera stroke="#3b82f6" width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={importStops}>
                <Upload stroke="#3b82f6" width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>

          {stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopItem}>
              <View style={styles.stopHeader}>
                <View style={styles.stopNumberBadge}>
                  <Text style={styles.stopNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stopAddress} numberOfLines={1}>
                  {stop.address}
                </Text>
                <TouchableOpacity onPress={() => removeStop(stop.id)}>
                  <Text style={styles.removeStopText}>Remove</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.stopDetails}>
                <View style={styles.detailRow}>
                  <Clock stroke="#64748b" width={16} height={16} />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="From"
                    value={stop.timeWindow.from}
                    onChangeText={(text) => updateStop(stop.id, "timeWindow", { ...stop.timeWindow, from: text })}
                  />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="To"
                    value={stop.timeWindow.to}
                    onChangeText={(text) => updateStop(stop.id, "timeWindow", { ...stop.timeWindow, to: text })}
                  />
                </View>

                <View style={styles.detailRow}>
                  <Flag stroke="#64748b" width={16} height={16} />
                  <TouchableOpacity
                    style={styles.prioritySelector}
                    onPress={() => {
                      const priorities = ["Low", "Normal", "High"]
                      const currentIndex = priorities.indexOf(stop.priority)
                      const nextPriority = priorities[(currentIndex + 1) % priorities.length]
                      updateStop(stop.id, "priority", nextPriority)
                    }}
                  >
                    <PriorityBadge priority={stop.priority} />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailRow}>
                  <Package stroke="#64748b" width={16} height={16} />
                  <TextInput
                    style={styles.packageInput}
                    placeholder="Package details"
                    value={stop.packageDetails}
                    onChangeText={(text) => updateStop(stop.id, "packageDetails", text)}
                  />
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addStopButton}
            onPress={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
            <Plus stroke="#ffffff" width={24} height={24} />
            <Text style={styles.addStopText}>Add Another Stop</Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity style={styles.optimizeButton} onPress={handleOptimizeRoute}>
          <MapPin stroke="#ffffff" width={24} height={24} />
          <Text style={styles.optimizeButtonText}>Optimize Route</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardAvoidingView: {
    flex: 1,
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
  scrollContent: {
    padding: 16,
  },
  routeTitleInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    paddingVertical: 8,
    marginBottom: 24,
  },
  stopInputContainer: {
    marginBottom: 16,
  },
  addressInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  autocompleteList: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    marginTop: 4,
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
  },
  stopItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stopHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stopNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stopNumberText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  stopAddress: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  removeStopText: {
    color: "#ef4444",
    fontWeight: "500",
  },
  stopDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  prioritySelector: {
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  packageInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  addStopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  addStopText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  optimizeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  optimizeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 8,
  },
})

