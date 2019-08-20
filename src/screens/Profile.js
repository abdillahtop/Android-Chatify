import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity } from 'react-native';
import User from '../User'

export default class App extends Component {

    _logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('SplashScreen')
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    {User.email}
                </Text>
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
