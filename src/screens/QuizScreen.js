import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';

function QuizScreen(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Quiz Screen </Text>
        <Navbar/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FCE4EC',
    },
    text: {
        fontSize: 20,
        color: '#000',
    },
})

export default QuizScreen;