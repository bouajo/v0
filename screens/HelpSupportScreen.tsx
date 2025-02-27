"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from "react-native-feather"
import Collapsible from "react-native-collapsible"
import { WebView } from "react-native-webview"
import Modal from "react-native-modal"

const FAQData = [
  {
    title: "Route Creation Issues",
    items: [
      {
        question: "How do I create a new route?",
        answer:
          'To create a new route, go to the Dashboard and tap on the "Create New Route" button. Then, follow the on-screen instructions to add stops and optimize your route.',
      },
      {
        question: "Can I import addresses from a file?",
        answer:
          'Yes, you can import addresses from a CSV file. On the Route Creation screen, tap the "Import" button and select your file.',
      },
    ],
  },
  {
    title: "Navigation Problems",
    items: [
      {
        question: "The app is not showing the correct route",
        answer:
          "Ensure you have a stable internet connection and that your GPS is enabled. If the problem persists, try restarting the app.",
      },
      {
        question: "How do I change the navigation app?",
        answer:
          'You can change your preferred navigation app in the Settings screen under "Route & Navigation Settings".',
      },
    ],
  },
  {
    title: "Billing Questions",
    items: [
      {
        question: "How do I upgrade my subscription?",
        answer:
          'To upgrade your subscription, go to the Settings screen and tap on "Upgrade" under the Subscription & Billing section.',
      },
      {
        question: "I was charged incorrectly, what should I do?",
        answer:
          'If you believe you were charged incorrectly, please contact our support team immediately through the "Contact Support" option on this screen.',
      },
    ],
  },
]

export default function HelpSupportScreen() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState([])
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")

  const toggleSection = (index) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter((i) => i !== index))
    } else {
      setExpandedSections([...expandedSections, index])
    }
  }

  const filteredFAQData = FAQData.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((section) => section.items.length > 0)

  const handleContactSupport = (method) => {
    switch (method) {
      case "chat":
        Alert.alert("Live Chat", "Connecting to a support agent...")
        break
      case "email":
        Alert.alert("Email Support", "Opening email client...")
        break
      case "phone":
        Alert.alert("Phone Support", "Calling support line...")
        break
    }
  }

  const handleSubmitFeedback = () => {
    if (feedbackText.trim() === "") {
      Alert.alert("Error", "Please enter your feedback before submitting.")
      return
    }
    // Here you would typically send the feedback to your backend
    Alert.alert("Thank You", "Your feedback has been submitted successfully!")
    setFeedbackText("")
    setFeedbackModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchContainer}>
          <Search stroke="#64748b" width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.faqContainer}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFAQData.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.faqSection}>
              <TouchableOpacity style={styles.faqSectionHeader} onPress={() => toggleSection(sectionIndex)}>
                <Text style={styles.faqSectionTitle}>{section.title}</Text>
                {expandedSections.includes(sectionIndex) ? (
                  <ChevronUp stroke="#0f172a" width={20} height={20} />
                ) : (
                  <ChevronDown stroke="#0f172a" width={20} height={20} />
                )}
              </TouchableOpacity>
              <Collapsible collapsed={!expandedSections.includes(sectionIndex)}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  </View>
                ))}
              </Collapsible>
            </View>
          ))}
        </View>

        <View style={styles.tutorialContainer}>
          <Text style={styles.sectionTitle}>Tutorial Videos</Text>
          <WebView
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: "https://www.youtube.com/embed/dQw4w9WgXcQ" }}
          />
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity style={styles.contactButton} onPress={() => handleContactSupport("chat")}>
            <MessageCircle stroke="#ffffff" width={24} height={24} />
            <Text style={styles.contactButtonText}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={() => handleContactSupport("email")}>
            <Mail stroke="#ffffff" width={24} height={24} />
            <Text style={styles.contactButtonText}>Email Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={() => handleContactSupport("phone")}>
            <Phone stroke="#ffffff" width={24} height={24} />
            <Text style={styles.contactButtonText}>Call Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.feedbackButton} onPress={() => setFeedbackModalVisible(true)}>
          <Text style={styles.feedbackButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        isVisible={isFeedbackModalVisible}
        onBackdropPress={() => setFeedbackModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Submit Feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            multiline
            numberOfLines={4}
            placeholder="Enter your feedback here..."
            value={feedbackText}
            onChangeText={setFeedbackText}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  faqContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  faqSection: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  faqSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  faqItem: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#64748b",
  },
  tutorialContainer: {
    marginBottom: 24,
  },
  webview: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  contactContainer: {
    marginBottom: 24,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  contactButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  feedbackButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  feedbackButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  feedbackInput: {
    width: "100%",
    height: 100,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

