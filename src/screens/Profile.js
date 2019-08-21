import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity, Image } from 'react-native';
import firebase from 'firebase'
import { Auth, Database } from '../config/firebase'

export default class App extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            myid: ''
        }
        AsyncStorage.getItem('userid', (error, result) => {
            if (result) {
                this.setState({
                    myid: result
                })
            }
        })
    }

    _logOut = async () => {
        // console.warn("userid", this.state.myid)
        Database.ref('/users/' + this.state.myid).update({ status: 'offline' })
        Auth.signOut().then(() => {
            AsyncStorage.clear();
            this.props.navigation.navigate('SplashScreen')
        })
            .catch((error) => {
                alert('error', error.message)
            })
    }

    componentWillMount = async () => {
        this.getData()
    }

    getData = async () => {
        // console.warn("long", this.state.longitude)
        // console.warn("lat", this.state.latitude)
        let dbRef = firebase.database().ref('users');
        let myid = await AsyncStorage.getItem('userid');
        dbRef.on('child_added', (val) => {
            let person = val.val();

            if (person.id === myid) {
                this.setState((prevState) => {
                    return {
                        data: [...prevState.data, person]
                    }
                })
            }

        })
    }

    render() {
        console.warn("data yg ini", this.state.data)
        return (
            <View style={styles.container}>
                {
                    this.state.data.map(user => {
                        console.warn("data user ", user)
                        return (
                            <View style={styles.layProfile}>
                                <Image style={styles.photo} source={{ uri: user.avatar }} />
                                <View style={{ alignItems: 'center', marginTop: -30 }}>
                                    <View style={styles.information}>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Status</Text>
                                            <Text style={styles.textUser}>{user.status}</Text>
                                        </View>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Name</Text>
                                            <Text style={styles.textUser}>{user.name}</Text>
                                        </View>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Email</Text>
                                            <Text style={styles.textUser}>{user.email}</Text>
                                        </View>
                                        <View style={styles.layText}>
                                            <Text style={styles.textTag}>Phone</Text>
                                            <Text style={styles.textUser}>{user.phone}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.layLogout}>
                                        <TouchableOpacity onPress={this._logOut}>
                                            <Text style={styles.logout}>Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        )
                    })

                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    layProfile: {
        width: '100%'
    },
    logo: {
        marginTop: -50,
        scaleX: 0.4,
        scaleY: 0.4
    },
    photo: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
    },
    textTag: {
        fontSize: 16,
        color: '#888',
        fontWeight: '400',
        width: '30%'
    },
    textUser: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
        textAlign: 'right',
        width: '70%'
    },
    information: {
        width: '90%',
        height: 'auto',
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 15,
    },
    layText: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.4
    },
    layLogout: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: '90%',
        opacity: .85
    },
    logout: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    }

});
