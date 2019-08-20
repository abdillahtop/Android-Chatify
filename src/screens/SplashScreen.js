import React from 'react'
import { Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native'
import firebase from 'firebase'
import User from '../User'

export default class SplashScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    componentWillMount() {
        var config = {
            apiKey: "AIzaSyCadzINZnyDcVDpwjuQXh5H4RiCu9hgEys",
            authDomain: "chatify-d30d5.firebaseapp.com",
            databaseURL: "https://chatify-d30d5.firebaseio.com",
            projectId: "chatify-d30d5",
            storageBucket: "",
            messagingSenderId: "752254279622",
        }
        firebase.initializeApp(config)
    }
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        User.email = await AsyncStorage.getItem('Email');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(User.email ? 'Home' : 'Login');
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