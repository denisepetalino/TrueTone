import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import axios from 'axios';
import Navbar from '../components/Navbar';

const { width, height } = Dimensions.get('window');

const UploadScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getDominantColour = async (imageUri) => {
    const apiKey = 'acc_c81892371f84ef4';
    const apiSecret = '68f7fec60d94da579946e11f5d331552';
    const encodedAuth = base64.encode(`${apiKey}:${apiSecret}`);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      const response = await axios.post(
        'https://api.imagga.com/v2/colors',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Basic ${encodedAuth}`,
          },
        }
      );

      const colour = response.data.result.colors.image_colors[0].html_code;
      return colour;
    } catch (error) {
      console.error('Axios error fetching dominant colour:', error.response?.data || error.message);
      return null;
    }
  };

  const handleSaveImage = async () => {
    if (!imageUri) return;
    setIsSaving(true);

    const dominantColour = await getDominantColour(imageUri);
    if (!dominantColour) {
      Alert.alert('Error', 'Could not detect colour. Try a clearer photo.');
      setIsSaving(false);
      return;
    }

    const newItem = {
      uri: imageUri,
      dominantColour,
    };

    try {
      const storedItems = await AsyncStorage.getItem('wardrobeItems');
      const parsed = storedItems ? JSON.parse(storedItems) : [];

      const updatedItems = [...parsed, newItem];
      await AsyncStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));

      Alert.alert('Saved!', 'Item added to your wardrobe.');
      setImageUri(null);
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ TEST BUTTON FUNCTION
  const testImaggaWithImageURL = async () => {
    const apiKey = 'acc_c81892371f84ef4';
    const apiSecret = '68f7fec60d94da579946e11f5d331552';
    const encodedAuth = base64.encode(`${apiKey}:${apiSecret}`);

    try {
      const response = await axios.get(
        'https://api.imagga.com/v2/colors?image_url=https://docs.imagga.com/static/images/docs/sample/japan-605234_1280.jpg',
        {
          headers: {
            Authorization: `Basic ${encodedAuth}`,
          },
        }
      );

      const colour = response.data.result.colors.image_colors[0].html_code;
      console.log('🎨 Dominant colour from URL:', colour);
      Alert.alert('Dominant Colour (from URL)', colour);
    } catch (error) {
      console.error('Test URL colour error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to get colour from URL.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take a Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testImaggaWithImageURL}>
            <Text style={styles.buttonText}>Test API from URL</Text>
          </TouchableOpacity>

          {imageUri && (
            <>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <TouchableOpacity style={styles.button} onPress={handleSaveImage} disabled={isSaving}>
                <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save to Wardrobe'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
    paddingTop: 50,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 120,
  },
  logo: {
    width: width * 1.1,
    height: height * 0.17,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  box: {
    borderWidth: 6,
    borderColor: '#DB7C87',
    borderStyle: 'dashed',
    width: '90%',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 30,
    marginTop: 10,
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
    marginTop: 5,
  },
  subtext: {
    fontSize: 15,
    color: '#EFB0B7',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 50,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#DB7C87',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    width: width * 0.6,
    height: width * 0.8,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DB7C87',
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default UploadScreen;