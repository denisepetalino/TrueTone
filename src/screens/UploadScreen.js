import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UploadScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />
      <View style={styles.box}>
        <Image source={require('../assets/images/hellokittycamera.png')} />
        <Text style={styles.headingtext}>UPLOAD HERE!</Text>
        <Text style={styles.subtext}>
            1. use bright lighting {'\n'}
            2. avoid harsh shadows {'\n'}
            3. use a white background {'\n'}
            4. lay the item flat {'\n'}
            5. ensure the item fills the majority of the frame {'\n'}
        </Text>
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
    marginTop:40,
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#DB7C87',
    paddingVertical: 20,
    marginTop:138,
  },
  navIcon: {
    width: 50,
    height: 50,
  },
});

export default UploadScreen;