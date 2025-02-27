"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { MapPin, Clock, TrendingUp, Navigation } from "react-native-feather"

const { width, height } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Smart Route Planning",
    description: "Optimize your deliveries with AI-powered route planning",
    icon: (color: string) => <Navigation stroke={color} width={60} height={60} />,
  },
  {
    id: "2",
    title: "Real-time Traffic Updates",
    description: "Avoid delays with live traffic information",
    icon: (color: string) => <Clock stroke={color} width={60} height={60} />,
  },
  {
    id: "3",
    title: "Fuel & Time Savings",
    description: "Reduce costs and increase efficiency",
    icon: (color: string) => <TrendingUp stroke={color} width={60} height={60} />,
  },
  {
    id: "4",
    title: "Package Finder",
    description: "Quickly locate packages in your vehicle",
    icon: (color: string) => <MapPin stroke={color} width={60} height={60} />,
  },
]

export default function OnboardingScreen() {
  const navigation = useNavigation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef(null)

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index)
  }).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
    } else {
      // If we're at the last slide, we could navigate to login
      navigation.navigate("Login")
    }
  }

  const handleLogin = () => {
    navigation.navigate("Login")
  }

  const handleSignUp = () => {
    navigation.navigate("SignUp")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: "https://i.imgur.com/JQZxrAQ.png" }} style={styles.heroImage} resizeMode="contain" />
        <Text style={styles.heroTitle}>RouteOptimizer</Text>
        <Text style={styles.heroSubtitle}>Optimize your deliveries, save time and fuel</Text>
      </View>

      {/* Features Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.iconContainer}>{item.icon("#3b82f6")}</View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideDescription}>{item.description}</Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity }, currentIndex === index && styles.activeDot]}
            />
          )
        })}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={scrollTo}>
        <Text style={styles.nextButtonText}>{currentIndex === slides.length - 1 ? "Get Started" : "Next"}</Text>
      </TouchableOpacity>

      {/* Auth Buttons */}
      <View style={styles.authContainer}>
        <TouchableOpacity style={[styles.authButton, styles.signUpButton]} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.authButton, styles.loginButton]} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  heroContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  heroImage: {
    width: width * 0.6,
    height: height * 0.2,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  carouselContainer: {
    flex: 1,
    marginTop: 20,
  },
  slide: {
    width,
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#f0f9ff",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },
  slideDescription: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#1e3a8a",
  },
  nextButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    alignSelf: "center",
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  authContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  authButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
  },
  signUpButton: {
    backgroundColor: "#1e3a8a",
  },
  signUpButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#1e3a8a",
  },
  loginButtonText: {
    color: "#1e3a8a",
    fontSize: 16,
    fontWeight: "bold",
  },
})

