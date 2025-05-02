import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
    const navigation = useNavigation();

    return(
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image source={require('../assets/images/profileicon.png')} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
                <Image source={require('../assets/images/uploadicon.png')} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Wardrobe')}>
                <Image source={require('../assets/images/wardrobeicon.png')} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AnalyseMe')}>
                <Image source={require('../assets/images/quizicon.png')} style={styles.navIcon} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: '#DB7C87',
        paddingVertical: 15,
    },
    navIcon: {
        width: 50,
        height: 40,
        resizeMode: 'contain',
    },
});

export default Navbar;