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
import Navbar from '../components/Navbar';

const { width, height } = Dimensions.get('window');

const UploadScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const cloudName = 'dw7qc0ug0';
  const uploadPreset = 'truetone_uploads';

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted){
      Alert.alert(
        "Permission Required",
        "Allow access to your photo library to upload images?",
        [{text: `OK`}]
      );
      return;
    }

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
    if (!permission.granted){
      Alert.alert(
        "Permission Required",
        "Allow access to your camera to upload images?",
        [{text: `OK`}]
      );
      return;
    }

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

  const uploadToCloudinary = async (localUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Cloudinary upload:', data);

      const dominantColor = data.colors?.[0]?.[0] || null;
      return { secure_url: data.secure_url, dominantColor };
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      return null;
    }
  };

  const handleSaveImage = async () => {
    if (!imageUri) return;
    setIsSaving(true);

    const result = await uploadToCloudinary(imageUri);

    if (!result || !result.dominantColor) {
      Alert.alert('Error', 'Could not detect colour. Try a clearer photo.');
      setIsSaving(false);
      return;
    }

    const newItem = {
      uri: result.secure_url,
      dominantColor: result.dominantColor,
    };

    try {
      const storedItems = await AsyncStorage.getItem('wardrobeItems');
      const parsed = storedItems ? JSON.parse(storedItems) : [];

      const updatedItems = [...parsed, newItem];
      await AsyncStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));

      Alert.alert('Saved!', `Item added to your wardrobe.\nDetected colour: ${result.dominantColor}`);
      setImageUri(null); 
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setIsSaving(false);
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