import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';

const { width, height } = Dimensions.get('window');

const AnalyseMeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
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
      <SafeAreaView style = {styles.navbarWrapper}>
        <Navbar/>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
  },
  logo: {
    width: width * 1.1,
    height: height * 0.17,
    resizeMode: 'contain',
  },
  box: {
    borderWidth: 6,
    borderRadius: 20,
    borderColor: '#DB7C87',
    borderStyle: 'dashed',
    width: '90%',
    height: '55%',
    alignItems: 'center',
    flexGrow:1,
    marginBottom: 180,
    marginTop: 30,
  },
  star: {
    width: width * 0.35,
    height: width * 0.35,
    resizeMode: 'contain',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#EFB0B7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 20,
    color: '#EFB0B7',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 50,
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left:0,
    right:0,
  },
});

export default AnalyseMeScreen;