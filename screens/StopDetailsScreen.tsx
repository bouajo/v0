"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Phone, MessageCircle, Camera, Check, AlertTriangle } from "react-native-feather"
import SignatureCapture from "react-native-signature-capture"
import ImagePicker from "react-native-image-picker"
import Communications from "react-native-communications"

export default function StopDetailsScreen({ route }) {
  const navigation = useNavigation()
  const { stop } = route.params
  const [signature, setSignature] = useState(null)
  const [proofPhoto, setProofPhoto] = useState(null)

  const handleCall = () => {
    Communications.phonecall(stop.phoneNumber, true)
  }

  const handleMessage = () => {
    Communications.text(stop.phoneNumber)
  }

  const handleCaptureSignature = () => {
    // This will be called when the signature is saved
  }

  const handleCapturePhoto = () => {
    const options = {
      title: "Take Proof of Delivery Photo",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker")
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error)
      } else {
        setProofPhoto(response.uri)
      }
    })
  }

  const handleMarkDelivered = () => {
    if (!signature && !proofPhoto) {
      Alert.alert("Missing Proof", "Please capture a signature or photo before marking as delivered.")
      return
    }
    // Here you would typically send the delivery confirmation to your backend
    Alert.alert("Success", "Stop marked as delivered!", [{ text: "OK", onPress: () => navigation.goBack() }])
  }

  const handleReportIssue = () => {
    // Here you would typically navigate to an issue reporting screen
    Alert.alert("Report Issue", "Navigate to issue reporting screen")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft stroke="#0f172a" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stop Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.stopInfo}>
          <Text style={styles.recipientName}>{stop.recipientName}</Text>
          <Text style={styles.address}>{stop.address}</Text>
          <Text style={styles.timeWindow}>
            {stop.timeWindow.from} - {stop.timeWindow.to}
          </Text>
          {stop.instructions && <Text style={styles.instructions}>{stop.instructions}</Text>}
        </View>

        <View style={styles.packageInfo}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <Text style={styles.packageLocation}>Location: {stop.packageLocation}</Text>
          {stop.labelImage && <Image source={{ uri: stop.labelImage }} style={styles.labelImage} />}
        </View>

        <View style={styles.contactOptions}>
          <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
            <Phone stroke="#ffffff" width={24} height={24} />
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={handleMessage}>
            <MessageCircle stroke="#ffffff" width={24} height={24} />
            <Text style={styles.contactButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.proofOfDelivery}>
          <Text style={styles.sectionTitle}>Proof of Delivery</Text>
          <SignatureCapture
            style={styles.signature}
            onSaveEvent={handleCaptureSignature}
            saveImageFileInExtStorage={false}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={"portrait"}
          />
          <TouchableOpacity style={styles.captureButton} onPress={handleCapturePhoto}>
            <Camera stroke="#ffffff" width={24} height={24} />
            <Text style={styles.captureButtonText}>Capture Photo</Text>
          </TouchableOpacity>
          {proofPhoto && <Image source={{ uri: proofPhoto }} style={styles.proofPhoto} />}
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.deliveredButton]} onPress={handleMarkDelivered}>
          <Check stroke="#ffffff" width={24} height={24} />
          <Text style={styles.actionButtonText}>Mark as Delivered</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.issueButton]} onPress={handleReportIssue}>
          <AlertTriangle stroke="#ffffff" width={24} height={24} />
          <Text style={styles.actionButtonText}>Report Issue</Text>
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
  stopInfo: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  recipientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: "#334155",
    marginBottom: 4,
  },
  timeWindow: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: "#334155",
    fontStyle: "italic",
  },
  packageInfo: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  packageLocation: {
    fontSize: 16,
    color: "#334155",
    marginBottom: 8,
  },
  labelImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 8,
  },
  contactOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  proofOfDelivery: {
    padding: 16,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  signature: {
    height: 200,
    marginBottom: 16,
  },
  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  captureButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  proofPhoto: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  deliveredButton: {
    backgroundColor: "#10b981",
  },
  issueButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
})

