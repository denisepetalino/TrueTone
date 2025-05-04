import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import Navbar from '../components/Navbar';

const { width, height } = Dimensions.get('window');

const NearbyCharitiesScreen = () => {
  const [charities, setCharities] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCharityIndex, setSelectedCharityIndex] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  const fetchNearbyCharities = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=office.charity&filter=circle:${longitude},${latitude},5000&bias=proximity:${longitude},${latitude}&limit=10&apiKey=ddfd6258ff2e4ab9848d1d59af84ae4b`
      );
      const data = await response.json();
      console.log(JSON.stringify(data.features, null,2));

      if (Array.isArray(data.features)) {
        setCharities(data.features);
      } else {
        setCharities([]);
      }
    } catch (error) {
      console.error('Error fetching charities:', error);
      setCharities([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLocation({ latitude, longitude });
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    fetchNearbyCharities(latitude, longitude);
  };

  const openDirections = (lat, lon, mode = 'driving') => {
    let url;
    if (Platform.OS === 'ios') {
      let appleMode = mode === 'walking' ? 'w' : mode === 'driving' ? 'd' : 'r';
      // Note: Apple Maps does not support cycling directions explicitly
      if (mode === 'bicycling') {
        appleMode = 'w'; // fallback to walking
      }
      url = `http://maps.apple.com/?daddr=${lat},${lon}&dirflg=${appleMode}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=${mode}`;
    }
    Linking.openURL(url);
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSelectCharity = (index) => {
    if (selectedCharityIndex === index) {
      setSelectedCharityIndex(null);
    } else {
      setSelectedCharityIndex(index);
      const coords = charities[index].geometry.coordinates;
      setMapRegion({
        latitude: coords[1],
        longitude: coords[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />

        <View style={styles.mapContainer}>
          {location && mapRegion && (
            <MapView style={styles.map} region={mapRegion}>
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="You"
                pinColor="blue"
              />
              {charities.map((c, idx) => (
                <Marker
                  key={idx}
                  coordinate={{
                    latitude: c.geometry.coordinates[1],
                    longitude: c.geometry.coordinates[0],
                  }}
                  pinColor={selectedCharityIndex === idx ? 'red' : '#DB7C87'}
                  onPress={() => handleSelectCharity(idx)}
                >
                  <Callout>
                    <View>
                      <Text style={{ fontWeight: 'bold' }}>{c.properties.name || 'Charity'}</Text>
                      <Text>{c.properties.address_line1}</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          )}
        </View>

        <View style={styles.charityList}>
          <Text style={styles.sectionTitle}>NEARBY CHARITIES</Text>
          {loading ? (
            <Text style={styles.emptyText}>Loading nearby charities...</Text>
          ) : charities.length > 0 ? (
            charities.map((c, idx) => {
              const isSelected = selectedCharityIndex === idx;
              const lat = c.geometry.coordinates[1];
              const lon = c.geometry.coordinates[0];
              const name = c.properties.name || 'Charity';
              return (
                <View key={idx}>
                  <TouchableOpacity
                    style={[styles.charityCard, isSelected && styles.charityCardSelected]}
                    onPress={() => handleSelectCharity(idx)}
                  >
                    <Text style={[styles.charityName, isSelected && styles.charityNameSelected]}>{name}</Text>
                    <Text style={[styles.charityAddress, isSelected && styles.charityAddressSelected]}>{c.properties.address_line1}</Text>
                  </TouchableOpacity>
                  {isSelected && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                      <TouchableOpacity onPress={() => openDirections(lat, lon, 'driving')} style={styles.directionsButton}>
                        <Text style={styles.directionsButtonText}>Drive</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openDirections(lat, lon, 'walking')} style={styles.directionsButton}>
                        <Text style={styles.directionsButtonText}>Walk</Text>
                      </TouchableOpacity>
                      {Platform.OS === 'android' && $1}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No nearby charities found.</Text>
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
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logo: {
    width: width * 1,
    height: height * 0.17,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  mapContainer: {
    height: 250,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#DB7C87',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  charityList: {
    paddingHorizontal: 20,
  },
  charityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#DB7C87',
  },
  charityCardSelected: {
    backgroundColor: '#DB7C87',
  },
  charityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DB7C87',
    fontFamily: 'HammersmithOne',
  },
  charityNameSelected: {
    color: '#fff',
  },
  charityAddress: {
    fontSize: 14,
    color: '#5A4E4C',
    fontFamily: 'Quicksand-Regular',
    marginTop: 4,
  },
  charityAddressSelected: {
    color: '#fff',
  },
  directionsButton: {
    backgroundColor: '#DB7C87',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  directionsButtonText: {
    color: 'white',
    fontFamily: 'HammersmithOne',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#DB7C87',
    fontFamily: 'HammersmithOne',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Quicksand-Regular',
  },
  navbarWrapper: {
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default NearbyCharitiesScreen;