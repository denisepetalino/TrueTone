import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../components/Navbar';

const { width, height } = Dimensions.get('window');

const profileData = {
    'Deep Winter': {
      description: 'This means you have intense contrast and cool undertones! Your features are bold and striking. Dark hair, vivid eyes, and luminous skin. Deep Winters shine in saturated, rich colours like plum, emerald, and deep navy. Icy accents and bright jewel tones will energise your look, while soft pastels or warm earth tones can dull your impact. You wear drama and elegance effortlessly!',
      palette: ['#000000', '#2C2C54', '#5B0E2D', '#990F4B', '#3E7CB1', '#007874', '#3B2F63', '#D72638', '#1B1B3A', '#E0D6EB', '#4A4E69', '#1C1C1C'],
      tone: 0.8,
      depth: 0.2,
    },
    'Cool Winter': {
      description: 'This means you have icy undertones and a crisp overall appearance! Your skin may be pale with a bluish base and your eyes often hold a steel, cool depth. Cool Winters are among the iciest of the Winter group, requiring strictly blue-based hues. Colours like raspberry, cobalt, emerald and icy lavender will highlight your sharpness, while warm or earth tones can look muddy. Silver and true white will complement you beautifully! Cool Winters are clean, controlled and classic.',
      palette: ['#003153', '#5A5B9F', '#A61C3C', '#284B63', '#4C516D', '#6B7AA1', '#1D3557', '#99BADD', '#2E3A59', '#7B2CBF', '#ECEBF3', '#171E2F'],
      tone: 0.85,
      depth: 0.5,
    },
    'Clear Winter': {
      description: 'This means you have high contrast and vivid clarity in your features! You likely have bright eyes, cool undertones, and a bold presence. Clear Winters sparkle in pure, saturated colours like electric blue, cherry red, emerald and icy pink. Muted tones or anything overly warm may flatten your look. You glow in crisp, icy contrast, think snow with a flash of neon!',
      palette: ['#000000', '#FFFFFF', '#FF0055', '#00BFFF', '#228B22', '#FF1493', '#9932CC', '#00CED1', '#FFC0CB', '#0047AB', '#66FF66', '#B0C4DE'],
      tone: 0.9,
      depth: 0.3,
    },
    'Light Spring': {
      description: 'This means you have delicate warmth and low contrast in your features! Light Springs often have light hair, soft warm eyes and fair skin with a peachy glow. You radiate in soft, fresh colours like peach, butter yellow, light aqua and coral pink. Dark or muted tones can feel heavy on you, so keep your palette light, bright and cheerful, like a spring garden in morning sun!',
      palette: ['#FFF8DC', '#F5DEB3', '#FAD6A5', '#FFE4E1', '#FFDDC1', '#FAFAD2', '#F7CAC9', '#BFD8EB', '#CDE7BE', '#FFE0AC', '#EED6C4', '#FFEBCD'],
      tone: 0.2,
      depth: 0.8,
    },
    'Warm Spring': {
      description: 'This means you’re glowing with sunny, golden warmth! Warm Springs often have peach-toned skin, warm green or hazel eyes, and golden or strawberry blonde hair. You look amazing in vibrant, warm hues like melon, sunflower, coral and mint. Avoid icy shades or anything too dark, your palette is all about radiance and energy!',
      palette: ['#FFD700', '#FFA500', '#F08080', '#E9967A', '#F4A460', '#FFDAB9', '#E1C699', '#D4AF37', '#E2725B', '#FDFD96', '#FFB347', '#DEB887'],
      tone: 0.2,
      depth: 0.6,
    },
    'Clear Spring': {
      description: 'This means your features are bright and crisp with a warm undertone! You likely have bright eyes, glowing skin and defined contrast in your look. Clear Springs sparkle in clean, warm colours like turquoise, coral, jade and bright yellow. Avoid muted or dusty tones, they can dull your brightness. Your vibe is joyful, energetic and full of life!',
      palette: ['#FFFF33', '#FFA07A', '#00FA9A', '#FF4500', '#FDFD96', '#00FFFF', '#FFC0CB', '#FF69B4', '#40E0D0', '#98FB98', '#E6E6FA', '#FF6347'],
      tone: 0.3,
      depth: 0.4,
    },
    'Soft Autumn': {
      description: 'This means your colouring is gentle, warm and low contrast. Soft Autumns often have hazel or green eyes, warm beige skin, and medium-toned hair. You look best in earthy, blended colours like sage, dusty rose, soft brown and taupe. Your palette is cozy, muted and romantic-like autumn mist and golden hour skies.',
      palette: ['#A39887', '#C3B091', '#BFA6A0', '#A49A87', '#C19A6B', '#BC987E', '#C4A69F', '#8E735B', '#AD8A64', '#BCA371', '#D2B48C', '#A17A74'],
      tone: 0.3,
      depth: 0.5,
    },
    'Warm Autumn': {
      description: 'This means you are enriched with golden undertones and a strong earthy presence! Warm Autumns typically have coppery or auburn hair, amber eyes, and skin that glows in golden browns. You shine in warm, rich colours like rust, olive, terracotta and deep mustard. Avoid icy or cool shades, they clash with your warmth. You radiate richness, strength and warmth.',
      palette: ['#A0522D', '#CD853F', '#B8860B', '#DAA520', '#556B2F', '#8B4513', '#CFA18D', '#D2691E', '#FFA07A', '#BC8F8F', '#F4A460', '#964B00'],
      tone: 0.2,
      depth: 0.7,
    },
    'Deep Autumn': {
      description: 'This means your look is rich, dark and dramatic with warm undertones. Deep Autumns often have dark brown hair, deep-set eyes and warm olive or bronze skin. You glow in bold, warm shades like espresso, forest green, brick and ink navy. Light or pastel colours may wash you out. You’re at your best in strong, earthy elegance.',
      palette: ['#3B2F2F', '#401A1A', '#5D3A00', '#46211A', '#3E2723', '#4E342E', '#6E2C00', '#3E1F0D', '#7D4427', '#5A381E', '#402218', '#2C1608'],
      tone: 0.25,
      depth: 0.2,
    },
    'Cool Summer': {
      description: 'This means you have soft contrast and cool, refined undertones. Cool Summers usually have light ash brown hair, grey-blue or cool green eyes and pink-based skin. Your best colours are powdery and elegant, think lavender, periwinkle, cool rose and icy grey. Avoid warmth or strong contrast. You shine in effortless, romantic calm.',
      palette: ['#92A8D1', '#B3CDE0', '#C5CBE1', '#BFD8D2', '#C0B9DD', '#9BB7D4', '#B0C4DE', '#D3D3E3', '#6C7B8B', '#A9A9E0', '#B2BABB', '#91A3B0'],
      tone: 0.7,
      depth: 0.5,
    },
    'Soft Summer': {
      description: 'This means you’re all about subtle harmony and muted elegance. Soft Summers have low contrast between hair, skin and eyes, with soft cool undertones. You look best in dusty, muted colours like sage, mauve, heather grey and powder blue. Brights or warm hues can be overpowering. Your beauty lies in softness and stillness.',
      palette: ['#A3B9C9', '#BCCAD6', '#C4B7CB', '#A8B0B6', '#BDC6D1', '#A6A6A6', '#BEBFC5', '#C3C6C8', '#C0BAAF', '#C5B9A5', '#99AABB', '#ADADAD'],
      tone: 0.6,
      depth: 0.6,
    },
    'Light Summer': {
      description: 'This means you have light, cool features and delicate contrast. Light Summers usually have blonde hair, grey-blue or green eyes, and pale pink-toned skin. Your best colours are soft, airy pastels like lilac, mint, periwinkle and soft rose. Avoid anything too dark or too warm. You shine in freshness and light.',
      palette: ['#E0BBE4', '#BFD8EB', '#CBAACB', '#B5EAD7', '#C7CEEA', '#F7CAC9', '#D5E1DF', '#E1EBEE', '#F0F8FF', '#D8BFD8', '#AFDBF5', '#F3E5F5'],
      tone: 0.6,
      depth: 0.8,
    },
  };

const ProfileScreen = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const storedResult = await AsyncStorage.getItem('seasonalColorProfile');
        setResult(storedResult);
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  const profile = profileData[result];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#DB7C87" />
      </View>
    );
  }

  if (!result || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />
        <Text style={styles.header}>Welcome to TrueTone!</Text>
        <Text style={styles.subtext}>Thank you for taking the time to be a part of my engineering project in my final year at Queen Mary University of London. This app was designed with active fashion and social media Gen Z users in mind, combining the fun of personal colour analysis with the convenience of your phone. Have fun :) </Text>
        <Image source={require('../assets/images/panda.png')} style={styles.panda} />
        <View style={styles.introcontainer}>
            <Text style={styles.subheading1}>HOW TO GET STARTED:</Text>
            <Text style={styles.instructions}> Start by taking a quick quiz to discover your personal colour profile. {'\n'}
                Then upload images of your wardrobe to find the items that truly suit YOU. {'\n'}
                Click the button below to begin.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AnalyseMe')}>
            <Text style={styles.buttonText}>LET'S GO!</Text>
            </TouchableOpacity>
        </View>
        <SafeAreaView style = {styles.navbarWrapper}>
            <Navbar/>
        </SafeAreaView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />

        <View style={styles.resultContainer}>
          <Text style={styles.title}>You are a</Text>
          <Text style={styles.result}>{result.toUpperCase()}!</Text>

          <Text style={styles.indicatorLabel}>WARM/COOL TONE</Text>
          <View style={styles.bar}>
            <LinearGradient
              colors={['#FFA500', '#0000FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBar}
            />
            <Image source={require('../assets/images/heartslider.png')} style={[styles.heartImage, { left: `${profile.tone * 100}%` }]} />
          </View>

          <Text style={styles.indicatorLabel}>LIGHT/DARK</Text>
          <View style={styles.bar}>
            <LinearGradient
              colors={['#F5F5F5', '#333333']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBar}
            />
            <Image source={require('../assets/images/heartslider.png')} style={[styles.heartImage, { left: `${profile.depth * 100}%` }]} />
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.description}>{profile.description}</Text>
          </View>

          <Text style={styles.subheading}>COLOURS THAT SUIT YOU:</Text>
          <View style={styles.paletteContainer}>
            {profile.palette.map((color, index) => (
              <View key={index} style={[styles.colorCircle, { backgroundColor: color }]} />
            ))}
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={async () => {
            await AsyncStorage.removeItem('seasonalColorProfile');
            navigation.replace('AnalyseMe');
        }}>
            <Text style={styles.resetButtonText}>RESET MY RESULTS</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
      <SafeAreaView style = {styles.navbarWrapper}>
        <Navbar/>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCE4EC',
    paddingTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
  },
  logo: {
    width: width * 1.1,
    height: height * 0.17,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  resultContainer: {
    backgroundColor: '#EFB0B7',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    minHeight: height * 0.8,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  result: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  indicatorLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-end',
    marginVertical: 7,
  },
  bar: {
    width: '100%',
    height: 60,
    backgroundColor: '#DB7C87',
    borderRadius: 15,
    justifyContent: 'center',
  },
  gradientBar: {
    ...StyleSheet.absoluteFillObject,
    width: '93%',
    height: 30,
    marginTop: 15,
    marginLeft: 13,
  },
  heartImage: {
    position: 'absolute',
    width: 35,
    height: 35,
    resizeMode: 'contain',
    top: 9,
    transform: [{translateX:-17.5}],
  },
  descriptionBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    width: '100%',
  },
  description: {
    fontSize: 18,
    color: '#B46770',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: 500,
  },
  subheading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 30,
    color: 'white',
    textAlign: 'center',
  },
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DB7C87',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#DB7C87',
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#DB7C87',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left:0,
    right:0,
  },
  resetButton: {
    backgroundColor: '#DB7C87',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subheading1: {
    fontSize: 25,
    textAlign: 'center',
    color: '#DB7C87',
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#DB7C87',
    padding: 10,
  },
  introcontainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: '80%',
    alignSelf: 'center',
  },
  panda: {
    width: width * 0.3,
    height: height * 0.1,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default ProfileScreen;