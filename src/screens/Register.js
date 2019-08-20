import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'

export default class Login extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        place: ''
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    errorRegister = async (error) => {
        alert.alert('Error', error.message)
    }

    successRegister = async (data) => {
        if (this.state.profile) {

        }
    }

    submitRegister = async () => {
        let email = this.state.email
        let password = this.state.password
        await firebase.auth()
            .createUser(email, password)
            .then()
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
                        <TouchableOpacity style={styles.layImage}>
                            <Image style={styles.image} source={require('../assets/user.png')} />
                        </TouchableOpacity>
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
                        <View style={{ flexDirection: 'row' }}>
                            <Icon size={24} name={'md-business'} style={styles.icon} />
                            <TextInput
                                placeholder="Place"
                                style={styles.input}
                                value={this.state.place}
                                onChangeText={this.handleChange('place')}
                            />
                        </View>
                    </View >
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.butRegist}>
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