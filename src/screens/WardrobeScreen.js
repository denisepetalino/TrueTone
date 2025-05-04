import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/Navbar';
import profileData from '../data/profileData';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SWIPE_THRESHOLD = 100;

const WardrobeScreen = ({ navigation }) => {
  const [keepItems, setKeepItems] = useState([]);
  const [discardItems, setDiscardItems] = useState([]);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [donatedItems, setDonatedItems] = useState([]);
  const [rescuedItems, setRescuedItems] = useState([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [finalDonatedItems, setFinalDonatedItems] = useState([]);

  const position = useRef(new Animated.ValueXY()).current;

  const hexToRgb = hex => {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  };

  const colorDistance = (c1, c2) => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  };

  const isColorClose = (itemColor, paletteColors, threshold = 60) => {
    const rgb1 = hexToRgb(itemColor);
    return paletteColors.some(palColor => {
      const rgb2 = hexToRgb(palColor);
      return colorDistance(rgb1, rgb2) < threshold;
    });
  };

  const loadData = async () => {
    const profileKey = await AsyncStorage.getItem('seasonalColorProfile');
    const wardrobeRaw = await AsyncStorage.getItem('wardrobeItems');
    const wardrobeItems = wardrobeRaw ? JSON.parse(wardrobeRaw) : [];
    if (!profileKey || wardrobeItems.length === 0) {
      setShowLockModal(true);
      return;
    }
    const palette = profileData[profileKey]?.palette || [];
    const keep = [], discard = [];
    wardrobeItems.forEach(item => {
      if (isColorClose(item.dominantColor, palette)) keep.push(item);
      else discard.push(item);
    });
    setKeepItems(keep);
    setDiscardItems(discard);
  };

  const resetWardrobe = async () => {
    await AsyncStorage.removeItem('wardrobeItems');
    setKeepItems([]);
    setDiscardItems([]);
    setCardIndex(0);
    setDonatedItems([]);
    setRescuedItems([]);
    setShowResetModal(false);
    await loadData();
  };

  useEffect(() => { loadData(); }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: position.x },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipe('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipe = (direction) => {
    const current = discardItems[cardIndex];
    if (!current) return;

    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      const updatedDiscard = [...discardItems];
      updatedDiscard.splice(cardIndex, 1);

      if (direction === 'right') {
        setDonatedItems(prev => [...prev, current]);
      } else {
        setKeepItems(prev => [...prev, current]);
      }

      setDiscardItems(updatedDiscard);
      setCardIndex(prev => Math.min(prev, updatedDiscard.length - 1));
      position.setValue({ x: 0, y: 0 });
    });
  };

  const renderFullscreen = () => {
    const current = discardItems[cardIndex];
    if (!current) return null;

    const yesOpacity = position.x.interpolate({
      inputRange: [0, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const noOpacity = position.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.fullscreenBackdrop}>
        <Text style={styles.fullscreenInstruction}>swipe RIGHT to DONATE (✓) {"\n"} swipe LEFT to KEEP (✗)</Text>
        <View style={styles.swipeLabels}>
          <Animated.Text style={[styles.noLabel, { opacity: noOpacity }]}>✗</Animated.Text>
          <Animated.Text style={[styles.yesLabel, { opacity: yesOpacity }]}>✓</Animated.Text>
        </View>
        <Animated.View style={[styles.fullscreenCard, { transform: [{ translateX: position.x }] }]} {...panResponder.panHandlers}>
          <Image source={{ uri: current.uri }} style={styles.fullscreenImage} />
        </Animated.View>
        <TouchableOpacity onPress={() => setFullscreenActive(false)} style={styles.closeFullscreen}>
          <Text style={styles.resetButtonText}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />

      <View style={styles.halfContainer}>
        <View style={styles.sectionKeep}>
          <Text style={styles.sectionTitle}>KEEP</Text>
          {keepItems.length > 0 ? (
            <FlatList
              data={keepItems}
              renderItem={({ item }) => (
                <Image source={{ uri: item.uri }} style={styles.itemImage} />
              )}
              horizontal
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.emptyText}>No matches yet</Text>
          )}
        </View>

        <View style={styles.sectionDiscard}>
          <Text style={styles.sectionTitle}>DISCARD</Text>
          {discardItems.length > 0 ? (
            <FlatList
              data={discardItems}
              renderItem={({ item }) => (
                <Image source={{ uri: item.uri }} style={styles.itemImage} />
              )}
              horizontal
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.emptyText}>No matches yet </Text>
          )}
          {discardItems.length > 0 && (
            <TouchableOpacity onPress={() => setFullscreenActive(true)} style={styles.fullscreenIcon}>
              <MaterialIcons name="fullscreen" size={24} color="#e3e3e3" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.resetWrapper}>
        <TouchableOpacity style={styles.resetButton} onPress={() => setShowResetModal(true)}>
          <Text style={styles.resetButtonText}>RESET WARDROBE</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.navbarWrapper}>
        <Navbar />
      </SafeAreaView>

      {fullscreenActive && renderFullscreen()}

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
    alignItems: 'center',
  },
  logo: {
    width: width * 1.1,
    height: height * 0.17,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  halfContainer: {
    flex: 1,
    width: '100%',
  },
  sectionKeep: {
    flex: 1,
    backgroundColor: '#C8FACC',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 5,
    alignItems: 'center',
  },
  sectionDiscard: {
    flex: 1,
    backgroundColor: '#F9A8A8',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5A4E4C',
    fontFamily: 'HammersmithOne',
  },
  itemImage: {
    width: width * 0.3,
    height: width * 0.4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DB7C87',
    alignSelf: 'center',
    marginRight: 10,
  },
  fullscreenBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullscreenInstruction: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 13,
  },
  fullscreenCard: {
    width: width * 0.75,
    height: width * 0.95,
    borderRadius: 20,
    overflow: 'hidden',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  swipeLabels: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '15%',
  },
  noLabel: {
    fontSize: 48,
    color: '#F44336',
    fontWeight: 'bold',
  },
  yesLabel: {
    fontSize: 48,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  closeFullscreen: {
    marginTop: 20,
    backgroundColor: '#DB7C87',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  fullscreenIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 2,
  },
  resetWrapper: {
    marginBottom: 60,
  },
  resetButton: {
    backgroundColor: '#DB7C87',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 25,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'HammersmithOne',
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