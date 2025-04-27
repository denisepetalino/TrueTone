import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';

const { width, height } = Dimensions.get('window');

function ProfileScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />
            <Text style={styles.text}> Profile Screen </Text>
        <SafeAreaView style = {styles.navbarWrapper}>
            <Navbar/>
        </SafeAreaView>
        </SafeAreaView>
    );
}

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
    navbarWrapper: {
        alignSelf: 'stretch',
        position: 'absolute',
        bottom: 0,
        left:0,
        right:0,
    },
    text: {
        fontSize: 20,
        color: '#000',
    },
})

export default ProfileScreen;