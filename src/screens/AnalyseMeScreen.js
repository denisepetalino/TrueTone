import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AnalyseMeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />
      <View style={styles.box}>
        <Image source={require('../assets/images/star.png')} style={styles.star} />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.buttonText}>ANALYSE ME!</Text>
        </TouchableOpacity>
        <Text style={styles.subtext}>take this quick and easy quiz to discover YOUR personal seasonal colour analysis</Text>
      </View>
      <View style={styles.navbar}>
        <Image source={require('../assets/images/profileicon.png')} style={styles.navIcon} />
        <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
            <Image source={require('../assets/images/uploadicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <Image source={require('../assets/images/wardrobeicon.png')} style={styles.navIcon} />
        <TouchableOpacity onPress={() => navigation.navigate('AnalyseMe')}>
            <Image source={require('../assets/images/quizicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
    paddingTop: 50,
    paddingBottom:20,
  },
  logo: {
    width: 480,
    height: 180,
    resizeMode: 'cover',
  },
  box: {
    borderWidth: 6,
    borderColor: '#DB7C87',
    borderStyle: 'dashed',
    width: '90%',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 50,
    marginTop:20,
  },
  star: {
    width: 160,
  },
  button: {
    backgroundColor: '#EFB0B7',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 19,
    color: '#EFB0B7',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 50,
    paddingBottom: 30,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#DB7C87',
    paddingVertical: 20,
    marginTop:79,
  },
  navIcon: {
    width: 50,
    height: 50,
  },
});

export default AnalyseMeScreen;