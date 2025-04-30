import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Image, Alert } from 'react-native';
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const questions = [
  {
    id: 1,
    factor: 'undertone',
    question: 'What jewellery suits you best?',
    options: ['Silver', 'Gold', 'Both equally'],
    image: require('../assets/images/quiz/silvergold.png'),
  },
  {
    id: 2,
    factor: 'undertone',
    question: 'What colour are the veins on your wrist?',
    options: ['Blue/Purple', 'Greenish', 'Can’t tell'],
    image: require('../assets/images/quiz/veins.jpg'),
  },
  {
    id: 3,
    factor: 'undertone',
    question: 'How does your skin react to the sun?',
    options: ['Burns easily, barely tans', 'Tans easily, rarely burns', 'Burns and tans'],
    image: require('../assets/images/quiz/sunburntan.png'),
  },
  {
    id: 4,
    factor: 'contrast',
    question: 'Is there a strong contrast between your hair, eyes, and skin?',
    options: ['Yes, stark contrast', 'No, everything blends softly'],
  },
  {
    id: 5,
    factor: 'contrast',
    question: 'Which describes your natural hair and eye combo?',
    options: ['Dark hair + light eyes/skin', 'Blonde/light brown hair + light eyes/skin'],
  },
  {
    id: 6,
    factor: 'contrast',
    question: 'Do bold, high-contrast outfits suit you better?',
    options: ['Yes, I stand out', 'No, softer blends feel better'],
  },
  {
    id: 7,
    factor: 'clarity',
    question: 'How do high-saturation colours (e.g., cobalt blue, emerald green) look on you?',
    options: ['They make me glow!', 'A bit too loud—I prefer toned-down colours', 'They’re okay, but deeper jewel tones suit me better', 'I avoid them—lighter colours are more flattering'],
  },
  {
    id: 8,
    factor: 'clarity',
    question: 'When wearing soft, dusty shades (e.g., sage green, dusty rose), your skin looks…',
    options: ['Washed out or dull', 'Harmonious, natural', 'Okay, but not my best', 'Even brighter or fresher'],
  },
  {
    id: 9,
    factor: 'clarity',
    question: 'Dark, rich colours (e.g., black, burgundy) make your features look…',
    options: ['Sharp and defined', 'A little harsh, prefer medium shades', 'Overpowering, I stick to lighter tones', 'They work, but I shine more in vibrant brights'],
  },
  {
    id: 10,
    factor: 'clarity',
    question: 'Pastel colours (e.g., baby pink, sky blue) make your complexion…',
    options: ['Glow, they flatter me', 'Look bland, I need more intensity', 'Feel soft and calm, I like them', 'Uneven, I avoid them'],
  },
  {
    id: 11,
    factor: 'clarity',
    question: 'Which of these patterns do you gravitate towards?',
    options: ['Crisp, high-contrast patterns (e.g., stripes, bold prints)', 'Soft, blended patterns (e.g., watercolor florals)', 'Strong, deep-toned patterns (e.g., paisley in jewel tones)', 'Light, airy patterns (e.g., small florals in pastel tones)'],
  },
];

const QuizScreen = () => {
  const [answers, setAnswers] = useState({});
  const navigation = useNavigation();

  const handleSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const calculateScore = async () => {
    let undertoneScore = 0;
    let contrastScore = 0;
    let clarityScore = 0;

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (!answer) return;

      if (q.factor === 'undertone') {
        if (['Silver', 'Blue/Purple', 'Burns easily, barely tans'].includes(answer)) {
          undertoneScore += 1;
        } else if (['Gold', 'Greenish', 'Tans easily, rarely burns'].includes(answer)) {
          undertoneScore -= 1;
        }
      } else if (q.factor === 'contrast') {
        if (['Yes, stark contrast', 'Dark hair + light eyes/skin', 'Yes, I stand out'].includes(answer)) {
          contrastScore += 1;
        } else {
          contrastScore -= 1;
        }
      } else if (q.factor === 'clarity') {
        if (
          ['They make me glow!', 'Washed out or dull', 'Sharp and defined', 'Glow, they flatter me'].includes(answer) ||
          answer.includes('high-contrast patterns')
        ) {
          clarityScore += 2;
        } else if (
          ['A bit too loud—I prefer toned-down colours', 'Harmonious, natural', 'A little harsh, prefer medium shades', 'Feel soft and calm, I like them'].includes(answer) ||
          answer.includes('blended patterns')
        ) {
          clarityScore -= 2;
        } else if (answer.includes('deeper jewel tones') || answer.includes('deep-toned patterns')) {
          clarityScore += 1;
        } else if (answer.includes('lighter colours') || answer.includes('light, airy patterns')) {
          clarityScore -= 1;
        }
      }
    });

    let result = '';
    if (undertoneScore > 0 && contrastScore > 0 && clarityScore >= 2) result = 'Clear Winter';
    else if (undertoneScore > 0 && contrastScore > 0 && clarityScore <= -1) result = 'Deep Winter';
    else if (undertoneScore > 0 && contrastScore > 0) result = 'Cool Winter';

    else if (undertoneScore > 0 && contrastScore < 0 && clarityScore >= 2) result = 'Light Summer';
    else if (undertoneScore > 0 && contrastScore < 0 && clarityScore <= -1) result = 'Soft Summer';
    else if (undertoneScore > 0 && contrastScore < 0) result = 'Cool Summer';

    else if (undertoneScore < 0 && contrastScore > 0 && clarityScore >= 2) result = 'Clear Autumn';
    else if (undertoneScore < 0 && contrastScore > 0 && clarityScore <= -1) result = 'Deep Autumn';
    else if (undertoneScore < 0 && contrastScore > 0) result = 'Warm Autumn';

    else if (undertoneScore < 0 && contrastScore < 0 && clarityScore >= 2) result = 'Clear Spring';
    else if (undertoneScore < 0 && contrastScore < 0 && clarityScore <= -1) result = 'Light Spring';
    else if (undertoneScore < 0 && contrastScore < 0) result = 'Warm Spring';

    else result = 'Neutral';

    try {
      await AsyncStorage.setItem('seasonalColorProfile', result);
      Alert.alert('Profile Saved!', `You are a ${result}.`, [
        { text: 'View Result', onPress: () => navigation.navigate('Profile', { result }) }
      ]);
    } catch (e) {
      console.error('Failed to save result:', e);
    }
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
                key={option}
                style={[styles.optionButton, answers[q.id] === option && styles.selectedOption]}
                onPress={() => handleSelect(q.id, option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.submitButton} onPress={calculateScore}>
          <Text style={styles.submitButtonText}>See My Colour Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      <SafeAreaView style={styles.navbarWrapper}>
        <Navbar />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCE4EC',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DB7C87',
    marginBottom: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default QuizScreen;