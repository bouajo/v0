"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { MapPin, Plus, User, TrendingUp, HelpCircle, Home, Clock, CheckCircle } from "react-native-feather"

const { width } = Dimensions.get("window")

// Mock data for routes
const mockRoutes = [
  {
    id: "1",
    name: "Downtown Deliveries",
    date: "2025-02-27",
    status: "in-progress",
    stops: 8,
    completedStops: 3,
  },
  {
    id: "2",
    name: "North Side Route",
    date: "2025-02-26",
    status: "completed",
    stops: 12,
    completedStops: 12,
  },
  {
    id: "3",
    name: "West End Deliveries",
    date: "2025-02-25",
    status: "in-progress",
    stops: 15,
    completedStops: 10,
  },
  {
    id: "4",
    name: "South Mall Deliveries",
    date: "2025-02-24",
    status: "completed",
    stops: 6,
    completedStops: 6,
  },
  {
    id: "5",
    name: "East Side Route",
    date: "2025-02-23",
    status: "completed",
    stops: 9,
    completedStops: 9,
  },
]

// Calculate quick stats
const calculateStats = (routes) => {
  const today = new Date().toISOString().split("T")[0]
  const todayRoutes = routes.filter((route) => route.date === today)

  const totalStops = routes.reduce((acc, route) => acc + route.stops, 0)
  const completedStops = routes.reduce((acc, route) => acc + route.completedStops, 0)
  const completionRate = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0

  return {
    todayRoutes: todayRoutes.length,
    totalStops,
    completedStops,
    completionRate,
  }
}

export default function DashboardScreen() {
  const navigation = useNavigation()
  const [routes, setRoutes] = useState(mockRoutes)
  const stats = calculateStats(routes)

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Render each route item
  const renderRouteItem = ({ item }) => {
    const statusColor = item.status === "completed" ? "#10b981" : "#f59e0b"
    const statusIcon =
      item.status === "completed" ? (
        <CheckCircle stroke="#10b981" width={16} height={16} />
      ) : (
        <Clock stroke="#f59e0b" width={16} height={16} />
      )

    return (
      <TouchableOpacity
        style={styles.routeItem}
        onPress={() => navigation.navigate("RouteDetails", { routeId: item.id })}
      >
        <View style={styles.routeHeader}>
          <Text style={styles.routeName}>{item.name}</Text>
          <Text style={styles.routeDate}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.routeStatus}>
            {statusIcon}
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status === "completed" ? "Completed" : "In Progress"}
            </Text>
          </View>

          <View style={styles.routeStops}>
            <MapPin stroke="#64748b" width={16} height={16} />
            <Text style={styles.stopsText}>
              {item.completedStops}/{item.stops} stops
            </Text>
          </View>
        </View>

        {item.status === "in-progress" && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(item.completedStops / item.stops) * 100}%` }]} />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Navbar */}
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>RouteOptimizer</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("Settings")}>
          <Image source={{ uri: "https://i.imgur.com/6Wd2lSS.png" }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.todayRoutes}</Text>
          <Text style={styles.statLabel}>Today's Routes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completedStops}</Text>
          <Text style={styles.statLabel}>Completed Stops</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>

      {/* Primary CTA */}
      <TouchableOpacity style={styles.createRouteButton} onPress={() => navigation.navigate("CreateRoute")}>
        <Plus stroke="#ffffff" width={20} height={20} />
        <Text style={styles.createRouteText}>Create New Route</Text>
      </TouchableOpacity>

      {/* Routes List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Routes</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Routes List */}
      <FlatList
        data={routes}
        renderItem={renderRouteItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.routesList}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home stroke="#3b82f6" width={24} height={24} />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Analytics")}>
          <TrendingUp stroke="#64748b" width={24} height={24} />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Support")}>
          <HelpCircle stroke="#64748b" width={24} height={24} />
          <Text style={styles.navText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Settings")}>
          <User stroke="#64748b" width={24} height={24} />
          <Text style={styles.navText}>Profile</Text>
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
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#e2e8f0",
  },
  createRouteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createRouteText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  routesList: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Add padding for bottom nav
  },
  routeItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  routeDate: {
    fontSize: 14,
    color: "#64748b",
  },
  routeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  routeStops: {
    flexDirection: "row",
    alignItems: "center",
  },
  stopsText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    width: width / 4 - 20,
  },
  navText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  activeNavText: {
    color: "#3b82f6",
    fontWeight: "500",
  },
})

