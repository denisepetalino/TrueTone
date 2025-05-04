import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../components/Navbar';
import { useFocusEffect } from '@react-navigation/native';
import profileData from '../data/profileData';
import Text from '../components/CustomText';
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  const profile = profileData[result];

  const toneX = useSharedValue(-50);  
  const depthX = useSharedValue(-50); 

  const resultScale = useSharedValue(0);

  useEffect(() => {
    if (profile) {
      toneX.value = withTiming(profile.tone * 100, { duration: 800 });
      depthX.value = withTiming(profile.depth * 100, { duration: 800 });
      resultScale.value = withTiming(1, { duration: 800 });
    }
  }, [profile]);

  const animatedToneStyle = useAnimatedStyle(() => ({
    left: `${toneX.value}%`,
  }));

  const animatedDepthStyle = useAnimatedStyle(() => ({
    left: `${depthX.value}%`,
  }));

  const animatedResultStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultScale.value }],
  }));

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
        <Text style={styles.header}>WELCOME TO TRUETONE!</Text>
        <Text style={styles.subtext}>Thank you for taking the time to be a part of my engineering project in my final year at Queen Mary University of London. This app was designed with active fashion and social media Gen Z users in mind, combining the fun of personal colour analysis with the convenience of your phone. Have fun :) </Text>
        <Image source={require('../assets/images/panda.png')} style={styles.panda} />
        <View style={styles.introcontainer}>
            <Text style={styles.subheading1}>HOW TO GET STARTED:</Text>
            <Text style={styles.instructions}> Take a quick quiz to discover your personal colour profile. {'\n'}
                Upload images of your wardrobe to find the items that truly suit YOU. {'\n'}
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
          
          <Animated.View style={[animatedResultStyle]}>
            <Text style={styles.result}>{result.toUpperCase()}!</Text>
          </Animated.View>

          <Image source={require('../assets/images/mymelody.jpg')} style={styles.resultimg} />

          <Text style={styles.indicatorLabel}>WARM/COOL TONE</Text>
          
          <View style={styles.bar}>
            <LinearGradient
              colors={['#FFA500', '#0000FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBar}
            />
            <Animated.Image
              source={require('../assets/images/heartslider.png')}
              style={[styles.heartImage, animatedToneStyle]}
            />
          </View>

          <Text style={styles.indicatorLabel}>LIGHT/DARK</Text>
          
          <View style={styles.bar}>
            <LinearGradient
              colors={['#F5F5F5', '#333333']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBar}
            />
            <Animated.Image
              source={require('../assets/images/heartslider.png')}
              style={[styles.heartImage, animatedDepthStyle]}
            />
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
            navigation.replace('Profile');
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
    width: width * 1,
    height: height * 0.17,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 120,
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
    fontSize: 25,
    color: 'white',
    fontFamily: 'QuickSand-Regular',
  },
  result: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'HammersmithOne',
  },
  indicatorLabel: {
    fontSize: 17,
    color: 'white',
    alignSelf: 'flex-end',
    marginVertical: 7,
    fontFamily: 'QuickSand-SemiBold',
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
    fontFamily: 'QuickSand-Light',
  },
  subheading: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 7,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'HammersmithOne',
  },
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    fontSize: 24,
    color: '#DB7C87',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'HammersmithOne',
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#DB7C87',
    paddingHorizontal: 40,
    fontFamily: 'QuickSand-Regular',
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
    fontSize: 17,
    fontFamily: 'HammersmithOne',
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
    fontSize: 23,
    textAlign: 'center',
    fontFamily: 'HammersmithOne',
  },
  subheading1: {
    fontSize: 25,
    textAlign: 'center',
    color: '#DB7C87',
    fontFamily: 'HammersmithOne',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#DB7C87',
    padding: 10,
    fontFamily: 'QuickSand-Regular',
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
  resultimg: {
    width: width * 0.2,
    height: height * 0.1,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 10,
  }
});

export default ProfileScreen;