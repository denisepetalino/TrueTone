import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/Navbar';
import profileData from '../data/profileData';

const { width, height } = Dimensions.get('window');

const WardrobeScreen = ({ navigation }) => {
  const [keepItems, setKeepItems] = useState([]);
  const [discardItems, setDiscardItems] = useState([]);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const profileKey = await AsyncStorage.getItem('seasonalColorProfile');
      const wardrobeRaw = await AsyncStorage.getItem('wardrobeItems');
      const wardrobeItems = wardrobeRaw ? JSON.parse(wardrobeRaw) : [];

      if (!profileKey || wardrobeItems.length === 0) {
        if (isMounted) {
          setShowLockModal(true);
        }
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

      if (isMounted) {
        setKeepItems(keep);
        setDiscardItems(discard);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderClothingItems = (items) =>
    items.map((item, index) => (
      <Image
        key={index}
        source={{ uri: item.uri }}
        style={styles.itemImage}
        resizeMode="cover"
      />
    ));

  const resetWardrobe = async () => {
    await AsyncStorage.removeItem('wardrobeItems');
    setKeepItems([]);
    setDiscardItems([]);
    setShowResetModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />

        <View style={styles.sectionKeep}>
          <Text style={styles.sectionTitle}>KEEP</Text>
          {keepItems.length > 0 ? renderClothingItems(keepItems) : (
            <Text style={styles.emptyText}>No matches yet</Text>
          )}
        </View>

        <View style={styles.sectionDiscard}>
          <Text style={styles.sectionTitle}>DISCARD</Text>
          {discardItems.length > 0 ? renderClothingItems(discardItems) : (
            <Text style={styles.emptyText}>No matches yet</Text>
          )}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={() => setShowResetModal(true)}>
          <Text style={styles.resetButtonText}>RESET WARDROBE</Text>
        </TouchableOpacity>
      </ScrollView>

      <SafeAreaView style={styles.navbarWrapper}>
        <Navbar />
      </SafeAreaView>

      {/* 🔒 Wardrobe Locked Modal */}
      <Modal
        visible={showLockModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLockModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Wardrobe Locked</Text>
            <Text style={styles.modalText}>
              Please complete the quiz and upload your clothes to unlock wardrobe filtering!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowLockModal(false);
                navigation.navigate('Quiz');
              }}
            >
              <Text style={styles.modalButtonText}>Go to Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowLockModal(false);
                navigation.navigate('Upload');
              }}
            >
              <Text style={styles.modalButtonText}>Upload Clothes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🧹 Reset Confirmation Modal */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Reset Wardrobe?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to remove all uploaded clothing items?
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#DB7C87' }]}
              onPress={resetWardrobe}
            >
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowResetModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'Quicksand-Regular',
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'HammersmithOne',
    marginBottom: 10,
    color: '#DB7C87',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#EFB0B7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 5,
    width: '100%',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'HammersmithOne',
  },
});

export default WardrobeScreen;