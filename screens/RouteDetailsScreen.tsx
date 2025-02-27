import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft } from "react-native-feather"

export default function RouteDetailsScreen({ route }) {
  const navigation = useNavigation()
  const { routeId } = route.params

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.routeId}>Route ID: {routeId}</Text>
        <Text style={styles.message}>Route details would be displayed here</Text>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  routeId: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#64748b",
  },
})

