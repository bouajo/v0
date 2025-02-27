import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Share2, Calendar } from "react-native-feather"
import { LineChart, PieChart } from "react-native-chart-kit"
import Share from "react-native-share"

const { width } = Dimensions.get("window")

// Mock data for the route summary
const routeSummary = {
  totalDistance: 120.5,
  totalTime: "5h 30m",
  averageSpeed: 22,
  stopsCompleted: 18,
  stopsAttempted: 20,
  successfulDeliveries: 18,
  failedDeliveries: 2,
  onTimeDeliveries: 16,
  lateDeliveries: 2,
}

// Mock data for the line chart
const performanceData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [85, 90, 88, 92, 87, 94, 91],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 2,
    },
  ],
}

export default function RouteSummaryScreen() {
  const navigation = useNavigation()

  const handleExport = async () => {
    try {
      const shareOptions = {
        title: "Route Summary",
        message: "Here is your route summary for today.",
        url: "data:text/csv;base64,Um91dGUgU3VtbWFyeSwKVG90YWwgRGlzdGFuY2UsMTIwLjUga20KVG90YWwgVGltZSw1aCAxMG0KQXZlcmFnZSBTcGVlZCwyMiBrbS9oCg==",
        type: "text/csv",
      }
      await Share.open(shareOptions)
    } catch (error) {
      console.error("Error sharing file:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>High-Level Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{routeSummary.totalDistance} km</Text>
              <Text style={styles.summaryLabel}>Total Distance</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{routeSummary.totalTime}</Text>
              <Text style={styles.summaryLabel}>Total Time</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{routeSummary.averageSpeed} km/h</Text>
              <Text style={styles.summaryLabel}>Avg. Speed</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {routeSummary.stopsCompleted}/{routeSummary.stopsAttempted}
              </Text>
              <Text style={styles.summaryLabel}>Stops Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.metricsCard}>
          <Text style={styles.cardTitle}>Delivery Metrics</Text>
          <PieChart
            data={[
              {
                name: "Successful",
                population: routeSummary.successfulDeliveries,
                color: "#10b981",
                legendFontColor: "#64748b",
              },
              {
                name: "Failed",
                population: routeSummary.failedDeliveries,
                color: "#ef4444",
                legendFontColor: "#64748b",
              },
            ]}
            width={width - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weekly Performance</Text>
          <LineChart
            data={performanceData}
            width={width - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
            <Share2 stroke="#ffffff" width={24} height={24} />
            <Text style={styles.actionButtonText}>Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("HistoricalData")}>
            <Calendar stroke="#ffffff" width={24} height={24} />
            <Text style={styles.actionButtonText}>View Historical Data</Text>
          </TouchableOpacity>
        </View>
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
  summaryCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  metricsCard: {
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
  chartCard: {
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
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
})

