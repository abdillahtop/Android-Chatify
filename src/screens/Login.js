import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar, Alert, AsyncStorage } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'

export default class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    loginFrom = async () => {
        const { email, password } = this.state
        if (email === '' || password === '') {
            Alert.alert('Error', 'Please Insert in Form')
        }
        else if (this.state.password.length < 5) {
            Alert.alert('Error', 'Password Must more than 6 character')
        } else {
            firebase.database().ref('/users').orderByChild('email').equalTo(email).once('value', (result) => {
                let data = result.val()
                console.warn("datanya: ", data)

                if (data !== null) {
                    let user = Object.values(data)
                    console.warn("user aja", user)
                    AsyncStorage.setItem('userdata', user[0].email)
                }
            })

            await firebase.auth().signInWithEmailAndPassword(email, password)
                .then((response) => {
                    console.warn("hasil response", response)
                    firebase.database().ref('/users/' + response.user.uid).update({ status: 'online' })
                    AsyncStorage.setItem('userid', response.user.uid)
                    this.props.navigation.navigate('Home')
                })
                .catch((error) => {
                    Alert.alert('Error', error.message)
                    this.setState({
                        email: '',
                        password: ''
                    })
                })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <ScrollView>
                    <View style={styles.layImage}>
                        <Image style={styles.image} source={require('../assets/logo.png')} />
                        <Text style={styles.textLogo}>Chatify</Text>
                    </View>
                    <View style={styles.layInput}>
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
                            <TouchableOpacity style={styles.butLogin} onPress={this.loginFrom}>
                                <Text style={styles.textLogin}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.butRegist} onPress={() => this.props.navigation.navigate('Register')}>
                                <Text style={styles.textSignUp}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
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
        scaleX: 0.5,
        scaleY: 0.5,
        rotation: -90
    },
    textLogo: {
        fontWeight: '900',
        fontSize: 28,
        marginTop: -50,
        marginBottom: 20
    },
    icon: {
        position: "absolute",
        marginTop: 12,
        marginLeft: 15,
        color: '#aaa'
    },
    layInput: {
        alignItems: 'center',
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
        backgroundColor: 'green',
        borderRadius: 10,
        width: '40%',
        alignItems: 'center'
    },
    textLogin: {
        fontWeight: '900',
        color: 'white'
    },
    butRegist: {
        padding: 15,
        width: '40%',
        alignItems: 'center'
    },
    textSignUp: {
        fontWeight: '900'
    }
});