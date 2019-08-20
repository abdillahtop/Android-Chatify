import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity } from 'react-native';
import { Auth, Database } from '../config/firebase'

export default class App extends Component {

    _logOut = async () => {
        const userToken = await AsyncStorage.getItem('userid')
        Database.ref('/users/' + userToken).update({ status: 'offline' })
        Auth.signOut().then(() => {
            AsyncStorage.clear();
            this.props.navigation.navigate('SplashScreen')
        })
            .catch((error) => {
                alert('error', error.message)
            })
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    console.warn("")
                }
                <TouchableOpacity onPress={this._logOut}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    logo: {
        marginTop: -50,
        scaleX: 0.4,
        scaleY: 0.4
    }
});
