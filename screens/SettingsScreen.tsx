"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, LogOut } from "react-native-feather"
import { ListItem } from "react-native-elements"
import { Picker } from "@react-native-picker/picker"
import Switch from "react-native-switch"

export default function SettingsScreen() {
  const navigation = useNavigation()
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [phone, setPhone] = useState("(555) 123-4567")
  const [optimizationPreference, setOptimizationPreference] = useState("fastest")
  const [preferredNavApp, setPreferredNavApp] = useState("google")
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.navigate("Login") },
    ])
  }

  const handleUpgradeSubscription = () => {
    // Implement subscription upgrade logic
    Alert.alert("Upgrade Subscription", "Subscription upgrade flow would start here.")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile & Account</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription & Billing</Text>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Current Plan</ListItem.Title>
              <ListItem.Subtitle>Pro Plan - $29.99/month</ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity onPress={handleUpgradeSubscription}>
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Payment Method</ListItem.Title>
              <ListItem.Subtitle>Visa ending in 1234</ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </ListItem>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View Billing History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route & Navigation Settings</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.inputLabel}>Default Optimization</Text>
            <Picker
              selectedValue={optimizationPreference}
              onValueChange={(itemValue) => setOptimizationPreference(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Fastest Route" value="fastest" />
              <Picker.Item label="Shortest Distance" value="shortest" />
              <Picker.Item label="Balanced" value="balanced" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.inputLabel}>Preferred Navigation App</Text>
            <Picker
              selectedValue={preferredNavApp}
              onValueChange={(itemValue) => setPreferredNavApp(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Google Maps" value="google" />
              <Picker.Item label="Waze" value="waze" />
              <Picker.Item label="Apple Maps" value="apple" />
            </Picker>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              circleSize={24}
              barHeight={30}
              circleBorderWidth={0}
              backgroundActive={"#3b82f6"}
              backgroundInactive={"#e2e8f0"}
              circleActiveColor={"#ffffff"}
              circleInActiveColor={"#ffffff"}
              changeValueImmediately={true}
              renderActiveText={false}
              renderInActiveText={false}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              circleSize={24}
              barHeight={30}
              circleBorderWidth={0}
              backgroundActive={"#3b82f6"}
              backgroundInactive={"#e2e8f0"}
              circleActiveColor={"#ffffff"}
              circleInActiveColor={"#ffffff"}
              changeValueImmediately={true}
              renderActiveText={false}
              renderInActiveText={false}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>SMS Notifications</Text>
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              circleSize={24}
              barHeight={30}
              circleBorderWidth={0}
              backgroundActive={"#3b82f6"}
              backgroundInactive={"#e2e8f0"}
              circleActiveColor={"#ffffff"}
              circleInActiveColor={"#ffffff"}
              changeValueImmediately={true}
              renderActiveText={false}
              renderInActiveText={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Connect CRM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Connect Inventory System</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut stroke="#ffffff" width={24} height={24} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  upgradeText: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  changeText: {
    color: "#3b82f6",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: "#0f172a",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 24,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
})

