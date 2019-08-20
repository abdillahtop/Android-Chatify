import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native'
import GetLocation from 'react-native-get-location'
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'
import { Database, Auth } from '../config/firebase'

export default class Login extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        latitude: null,
        longitude: null
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    registerForm = async () => {
        if (this.state.name === '' || this.state.email === '' || this.state.password === '') {
            alert('please insert in form')
        } else if (this.state.name < 4) {
            alert('Username must more than 3 character')
        } else {
            Auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((response) => {
                    console.warn(response)
                    Database.ref('/users/' + response.user.uid).set({
                        name: this.state.name,
                        email: this.state.email,
                        status: 'offline',
                        avatar: 'https://image.flaticon.com/icons/svg/149/149071.svg',
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    })
                    this.props.navigation.navigate('Login')
                })
                .catch(error => {
                    alert(error.message)
                    this.setState({
                        fullname: '',
                        email: '',
                        password: ''
                    })

                    this.props.navigation.navigate('Register')
                })
        }
    }

    getCurrentPosition() {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                console.warn(location.latitude);

                let region = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.00922 * 1.5,
                    longitudeDelta: 0.00421 * 1.5
                }

                this.setState({
                    mapRegion: region,
                    latitude: location.latitude,
                    longitude: location.longitude
                })
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <ScrollView>
                    <View style={{
                        alignItems: 'center', marginTop: 50
                    }}>
                        <Text style={styles.textLogo
                        } > REGISTER</Text>
                    </View>
                    <View style={styles.layInput}>
                        {/* <TouchableOpacity style={styles.layImage}>
                            <Image style={styles.image} source={require('../assets/user.png')} />
                        </TouchableOpacity> */}
                        <View style={{ flexDirection: 'row' }}>
                            <Icon size={24} name={'md-person'} style={styles.icon} />
                            <TextInput
                                placeholder="Name"
                                style={styles.input}
                                value={this.state.name}
                                onChangeText={this.handleChange('name')}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon size={24} name={'md-mail'} style={styles.icon} />
                            <TextInput
                                placeholder="Email"
                                style={styles.input}
                                value={this.state.email}
                                onChangeText={this.handleChange('email')}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon size={24} name={'md-lock'} style={styles.icon} />
                            <TextInput
                                placeholder="Password"
                                style={styles.input}
                                value={this.state.password}
                                secureTextEntry={true}
                                onChangeText={this.handleChange('password')}
                            />
                        </View>
                    </View >
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.butRegist} onPress={this.registerForm}>
                                <Text style={styles.textSignUp}>Sign Up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.butLogin} onPress={() => this.props.navigation.navigate('Login')}>
                                <Text style={styles.textLogin}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    layImage: {
        alignItems: 'center',
    },
    image: {
        scaleX: 0.2,
        scaleY: 0.2,
        marginVertical: -180,
    },
    textLogo: {
        fontWeight: '900',
        fontSize: 28,
    },
    icon: {
        position: "absolute",
        marginTop: 12,
        marginLeft: 15,
        color: '#aaa'
    },
    layInput: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#aaa',
        width: '80%',
        paddingLeft: 50,
        borderRadius: 5
    },
    butLogin: {
        padding: 15,
        width: '40%',
        alignItems: 'center'
    },
    textLogin: {
        fontWeight: '900'
    },
    butRegist: {
        padding: 15,
        backgroundColor: 'green',
        borderRadius: 10,
        width: '40%',
        alignItems: 'center'
    },
    textSignUp: {
        fontWeight: '900',
        color: 'white'
    }
});