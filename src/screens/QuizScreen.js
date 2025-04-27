import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';

const {width, height} = Dimensions.get('window');

const QuizScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/images/truetone-logo.png')} style={styles.logo} />
            <Text style={styles.text}> Quiz Screen </Text>
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
    text: {
        fontSize: 20,
        color: '#000',
    },
    navbarWrapper: {
        alignSelf: 'stretch',
        position: 'absolute',
        bottom: 0,
        left:0,
        right:0,
    },
})

export default QuizScreen;