import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/Navbar';
import profileData from '../data/profileData';

const { width, height } = Dimensions.get('window');

const WardrobeScreen = ({ navigation }) => {
  const [keepItems, setKeepItems] = useState([]);
  const [discardItems, setDiscardItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const profileKey = await AsyncStorage.getItem('seasonalColourProfile');
      const wardrobeRaw = await AsyncStorage.getItem('wardrobeItems');
      const wardrobeItems = wardrobeRaw ? JSON.parse(wardrobeRaw) : [];

      if (!profileKey || wardrobeItems.length === 0) {
        Alert.alert(
          'Wardrobe Locked',
          'Please complete the quiz and upload your clothes to unlock wardrobe filtering!',
          [
            { text: 'Go to Quiz', onPress: () => navigation.navigate('Quiz') },
            { text: 'Upload Clothes', onPress: () => navigation.navigate('Upload') }
          ]
        );
        return;
      }

      const palette = profileData[profileKey]?.palette || [];

      const keep = [];
      const discard = [];

      wardrobeItems.forEach(item => {
        if (palette.includes(item.dominantColor)) {
          keep.push(item);
        } else {
          discard.push(item);
        }
      });

      setKeepItems(keep);
      setDiscardItems(discard);
    };

    loadData();
  }, []);

  const renderClothingItems = (items) => (
    items.map((item, index) => (
      <Image
        key={index}
        source={{ uri: item.uri }}
        style={styles.itemImage}
        resizeMode="cover"
      />
    ))
  );

  const resetWardrobe = async () => {
    Alert.alert(
      'Reset Wardrobe?',
      'Are you sure you want to remove all uploaded clothing items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await AsyncStorage.removeItem('wardrobeItems');
            setKeepItems([]);
            setDiscardItems([]);
            Alert.alert('Wardrobe Cleared', 'All uploaded wardrobe items have been removed.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />

        <View style={styles.sectionKeep}>
          <Text style={styles.sectionTitle}>KEEP</Text>
          {keepItems.length > 0 ? renderClothingItems(keepItems) : <Text style={styles.emptyText}>No matches yet</Text>}
        </View>

        <View style={styles.sectionDiscard}>
          <Text style={styles.sectionTitle}>DISCARD</Text>
          {discardItems.length > 0 ? renderClothingItems(discardItems) : <Text style={styles.emptyText}>No matches yet</Text>}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetWardrobe}>
          <Text style={styles.resetButtonText}>RESET WARDROBE</Text>
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
    alignItems: 'center',
    paddingBottom: 120,
  },
  logo: {
    width: width * 1.1,
    height: height * 0.17,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#EFB0B7',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'HammersmithOne',
  },
  sectionKeep: {
    width: '90%',
    backgroundColor: '#C8FACC',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionDiscard: {
    width: '90%',
    backgroundColor: '#F9A8A8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5A4E4C',
    fontFamily: 'HammersmithOne',
  },
  itemImage: {
    width: width * 0.6,
    height: width * 0.8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DB7C87',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default WardrobeScreen;