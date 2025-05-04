import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Image, Modal } from 'react-native';
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
const { width } = Dimensions.get('window');

const profiles = [
  'Light Spring', 'Warm Spring', 'Clear Spring',
  'Light Summer', 'Cool Summer', 'Soft Summer',
  'Warm Autumn', 'Deep Autumn', 'Soft Autumn',
  'Cool Winter', 'Deep Winter', 'Clear Winter'
];

const questions = [
  {
    id: 1,
    question: 'Which jewellery flatters your skin tone most?',
    options: [
      { text: 'Silver, I look fresh and clear', scores: { 'Cool Summer': 2, 'Cool Winter': 2, 'Clear Winter': 1 } },
      { text: 'Gold, I glow in it', scores: { 'Warm Spring': 2, 'Warm Autumn': 2, 'Light Spring': 1 } },
      { text: 'Both, but silver slightly more', scores: { 'Soft Summer': 1, 'Cool Summer': 1, 'Deep Winter': 1 } },
      { text: 'Both, but gold slightly more', scores: { 'Soft Autumn': 1, 'Light Spring': 1, 'Deep Autumn': 1 } },
    ],
    image: require('../assets/images/quiz/silvergold.png'),
  },
  {
    id: 2,
    question: 'What colour are the veins on your wrist?',
    options: [
      { text: 'Blue or purple', scores: { 'Cool Summer': 2, 'Cool Winter': 2, 'Light Summer': 1 } },
      { text: 'Green or olive', scores: { 'Warm Autumn': 2, 'Warm Spring': 2, 'Light Spring': 1 } },
      { text: 'Hard to tell / mix of both', scores: { 'Soft Summer': 2, 'Soft Autumn': 2 } },
    ],
    image: require('../assets/images/quiz/veins.jpg'),
  },
  {
    id: 3,
    question: 'How does your skin react to sun exposure?',
    options: [
      { text: 'Burns quickly, hardly tans', scores: { 'Cool Summer': 2, 'Light Summer': 2, 'Clear Winter': 1 } },
      { text: 'Tans easily, rarely burns', scores: { 'Warm Autumn': 2, 'Deep Autumn': 2, 'Warm Spring': 1 } },
      { text: 'Burns then tans gradually', scores: { 'Soft Summer': 1, 'Light Spring': 1, 'Soft Autumn': 1 } },
    ],
    image: require('../assets/images/quiz/sunburntan.png'),
  },
  {
    id: 4,
    question: 'How much contrast is there between your hair, eyes, and skin?',
    options: [
      { text: 'High: e.g., dark hair and light skin/eyes', scores: { 'Clear Winter': 2, 'Deep Winter': 2, 'Clear Spring': 1 } },
      { text: 'Medium: some contrast but not sharp', scores: { 'Cool Summer': 1, 'Warm Autumn': 1, 'Deep Autumn': 1 } },
      { text: 'Low: everything blends softly', scores: { 'Soft Autumn': 2, 'Soft Summer': 2 } },
    ],
    image: require('../assets/images/quiz/contrast.png'),
  },
  {
    id: 5,
    question: 'Pick the combination closest to your natural hair and eye colour:',
    options: [
      { text: 'Light hair + light eyes', scores: { 'Light Spring': 2, 'Light Summer': 2 } },
      { text: 'Dark hair + light eyes', scores: { 'Clear Winter': 2, 'Clear Spring': 2 } },
      { text: 'Dark hair + dark eyes', scores: { 'Deep Autumn': 2, 'Deep Winter': 2 } },
      { text: 'Light hair + dark eyes', scores: { 'Warm Spring': 1, 'Soft Autumn': 1 } },
    ],
    image: require('../assets/images/quiz/darklight.png'),
  },
  {
    id: 6,
    question: 'Do bold, high-contrast outfits suit you?',
    options: [
      { text: 'Yes, I thrive in bold colours', scores: { 'Clear Winter': 2, 'Clear Spring': 2 } },
      { text: 'Sometimes, but soft blends look better', scores: { 'Soft Summer': 2, 'Soft Autumn': 2 } },
      { text: 'No, they overwhelm me', scores: { 'Light Spring': 1, 'Light Summer': 1 } },
    ],
    image: require('../assets/images/quiz/contrastoutfits.png'),
  },
  {
    id: 7,
    question: 'How do vivid, high-saturation colours look on you?',
    options: [
      { text: 'They make me glow!', scores: { 'Clear Spring': 2, 'Clear Winter': 2 } },
      { text: 'A bit too loud, I prefer toned-down colours', scores: { 'Soft Summer': 2, 'Soft Autumn': 2 } },
      { text: 'I prefer richer, deeper tones', scores: { 'Deep Autumn': 2, 'Deep Winter': 2 } },
      { text: 'I like light, soft colours more', scores: { 'Light Summer': 1, 'Light Spring': 1 } },
    ],
    image: require('../assets/images/quiz/bluegreen.png'),
  },
  {
    id: 8,
    question: 'How do dusty shades (like sage or dusty rose) affect your skin?',
    options: [
      { text: 'They wash me out or dull my features', scores: { 'Clear Spring': 2, 'Clear Winter': 2 } },
      { text: 'They harmonise beautifully with my tone', scores: { 'Soft Summer': 2, 'Soft Autumn': 2 } },
      { text: 'They’re okay but not my best', scores: { 'Cool Summer': 1, 'Warm Autumn': 1 } },
      { text: 'They brighten me up', scores: { 'Light Spring': 1, 'Light Summer': 1 } },
    ],
    image: require('../assets/images/quiz/sagerose.png'),
  },
  {
    id: 9,
    question: 'How do dark colours (like black or burgundy) affect your look?',
    options: [
      { text: 'Make my features pop, I look sharp', scores: { 'Deep Winter': 2, 'Deep Autumn': 2 } },
      { text: 'Too strong, I prefer softer midtones', scores: { 'Soft Summer': 2, 'Soft Autumn': 2 } },
      { text: 'They’re overpowering; I go for light colours', scores: { 'Light Spring': 1, 'Light Summer': 1 } },
      { text: 'They’re okay but vibrant brights suit me better', scores: { 'Clear Spring': 2, 'Clear Winter': 2 } },
    ],
    image: require('../assets/images/quiz/blackburgundy.png'),
  },
  {
    id: 10,
    question: 'What effect do pastel colours (like baby pink or sky blue) have on you?',
    options: [
      { text: 'They flatter me and make my skin glow', scores: { 'Light Spring': 2, 'Light Summer': 2 } },
      { text: 'They feel bland, I need more intensity', scores: { 'Clear Winter': 2, 'Deep Autumn': 1 } },
      { text: 'They feel gentle and calm, I like them', scores: { 'Soft Summer': 1, 'Soft Autumn': 1 } },
      { text: 'They’re not great, I prefer richer tones', scores: { 'Deep Winter': 1, 'Warm Autumn': 1 } },
    ],
    image: require('../assets/images/quiz/pinkblue.png'),
  },
  {
    id: 11,
    question: 'Which pattern type are you drawn to most?',
    options: [
      { text: 'Bold, high-contrast (e.g., stripes, graphic prints)', scores: { 'Clear Winter': 2, 'Clear Spring': 2 } },
      { text: 'Soft, watercolour blends', scores: { 'Soft Summer': 2, 'Soft Autumn': 2 } },
      { text: 'Rich, deep jewel-tone prints (e.g., paisley)', scores: { 'Deep Autumn': 2, 'Deep Winter': 2 } },
      { text: 'Light and delicate florals', scores: { 'Light Summer': 2, 'Light Spring': 2 } },
    ],
    image: require('../assets/images/quiz/patterns.png'),
  },
];

const QuizScreen = () => {
  const [answers, setAnswers] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [resultProfile, setResultProfile] = useState(null);
  const navigation = useNavigation();

  const handleSelect = (questionId, optionText) => {
    setAnswers({ ...answers, [questionId]: optionText });
  };

  const calculateScore = async () => {
    const profileScores = Object.fromEntries(profiles.map((p) => [p, 0]));

    questions.forEach((q) => {
      const selectedText = answers[q.id];
      if (!selectedText) return;
      const selectedOption = q.options.find(opt => opt.text === selectedText);
      if (!selectedOption) return;

      Object.entries(selectedOption.scores).forEach(([profile, value]) => {
        profileScores[profile] += value;
      });
    });

    const topProfile = Object.entries(profileScores).sort((a, b) => b[1] - a[1])[0][0];
    setResultProfile(topProfile);
    setModalVisible(true);
  };

  const handleViewResult = async () => {
    setModalVisible(false);
    await AsyncStorage.setItem('seasonalColorProfile', resultProfile);
    navigation.navigate('Profile', { result: resultProfile });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {questions.map((q) => (
          <View key={q.id} style={styles.questionBox}>
            {q.image && <Image source={q.image} style={styles.questionImage} />}
            <Text style={styles.questionText}>{q.question}</Text>
            {q.options.map((option) => (
              <TouchableOpacity
                key={option.text}
                style={[styles.optionButton, answers[q.id] === option.text && styles.selectedOption]}
                onPress={() => handleSelect(q.id, option.text)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.submitButton} onPress={calculateScore}>
          <Text style={styles.submitButtonText}>See My Colour Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.questionText}>You are a {resultProfile}!</Text>
            <TouchableOpacity style={styles.submitButton} onPress={handleViewResult}>
              <Text style={styles.submitButtonText}>View My Result</Text>
            </TouchableOpacity>
            <ConfettiCannon
              count={800}
              origin={{x:0,y:0}}
              fadeOut={true}
              fallSpeed={2000}
            />
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.navbarWrapper}>
        <Navbar />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCE4EC' },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  questionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#DB7C87',
  },
  questionImage: {
    width: width * 0.8,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DB7C87',
    margin: 15,
    textAlign: 'center',
    fontFamily: 'Quicksand-SemiBold',
  },
  optionButton: {
    backgroundColor: '#EFB0B7',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#DB7C87',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'HammersmithOne',
  },
  submitButton: {
    backgroundColor: '#DB7C87',
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'HammersmithOne',
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderColor: '#DB7C87',
    borderWidth: 2,
  },
});

export default QuizScreen;