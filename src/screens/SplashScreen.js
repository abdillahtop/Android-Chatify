import React from 'react'
import { Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native'
import firebase from 'firebase'

export default class SplashScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userid');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'Home' : 'Login');
    };

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate('Home')}>
                <Image style={styles.image} source={require('../assets/logo.png')} />
                <Text style={styles.logoName}>Chatify</Text>
                <ActivityIndicator />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {

    },
    logoName: {
        fontSize: 50,
        fontWeight: '900',
        color: '#333',
        marginTop: 20
    }
});