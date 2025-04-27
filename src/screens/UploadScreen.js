import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';

const {width, height} = Dimensions.get('window');

const UploadScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />
      <View style={styles.box}>
        <Image source={require('../assets/images/hellokittycamera.png')} style={styles.camera} />
        <Text style={styles.headingtext}>UPLOAD HERE!</Text>
        <Text style={styles.subtext}>
            1. use bright lighting {'\n'}
            2. avoid harsh shadows {'\n'}
            3. use a white background {'\n'}
            4. lay the item flat {'\n'}
            5. ensure the item fills the majority of the frame {'\n'}
        </Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
    paddingTop: 50,
    paddingBottom:20,
  },
  logo: {
    width: width * 1.1,
    height: height * 0.17,
    resizeMode: 'contain',
  },
  box: {
    borderWidth: 6,
    borderColor: '#DB7C87',
    borderStyle: 'dashed',
    width: '90%',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 50,
    marginTop:40,
    marginBottom: 12,
  },
  camera: {
    width: width * 0.2,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  headingtext: {
    color: '#DB7C87',
    fontSize: 35,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 15,
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

export default UploadScreen;