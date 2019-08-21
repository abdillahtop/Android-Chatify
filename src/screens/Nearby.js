import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Image, AsyncStorage, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import GetLocation from 'react-native-get-location'
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import { Database } from '../config/firebase'

export default class App extends Component {
    constructor() {
        super()
        this.state = {
            mapRegion: null,
            latitude: 0,
            longitude: 0,
            users: [],
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

    componentDidMount = async () => {
        this.getCurrentPosition()
        setInterval(() => this.updateLocation(), 10000);
    }

    updateLocation = async () => {
        // console.warn("long", this.state.longitude)
        // console.warn("lat", this.state.latitude)
        Database.ref('/users').orderByChild('id').equalTo(this.state.myid).once('value', (result) => {
            let data = result.val()
            // console.warn("datanya: ", data)

            Database.ref('/users/' + this.state.myid).update({ latitude: this.state.latitude, longitude: this.state.longitude })
        })
    }

    componentWillMount = async () => {
        let dbRef = firebase.database().ref('users');
        let myid = await AsyncStorage.getItem('userid');
        dbRef.on('child_added', (val) => {
            let person = val.val();

            if (person.id === myid) {
                myid = person.id
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }

        })
    }
    getCurrentPosition() {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
        })
            .then(location => {
                let region = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.00922 * 0.3,
                    longitudeDelta: 0.00421 * 0.3
                }

                this.setState({
                    mapRegion: region,
                    latitude: location.latitude,
                    longitude: location.longitude
                })
            })
            .catch(error => {
                const { code, message } = error;
                // console.warn(code, message);
            })
    }

    render() {
        // console.warn("longitude", this.state.longitude)
        // console.warn("latitude", this.state.latitude)
        // console.warn("user", this.state.users)
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="dark-content" />
                <MapView
                    provider={PROVIDER_GOOGLE}
                    showsMyLocationButton={true}
                    showsIndoorLevelPicker={true}
                    showsUserLocation={true}
                    zoomControlEnabled={false}
                    showsCompass={false}
                    showsBuildings={false}
                    showsScale={true}
                    region={this.state.mapRegion}
                    style={styles.map}
                >
                    {
                        this.state.users.map((item) => {
                            // console.warn("avatar", item.avatar)
                            // console.warn("item", item.latitude)
                            // console.warn("item", item.longitude)
                            return (
                                <Marker
                                    draggable
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                    }}
                                    title={item.name}
                                    description={`${item.latitude} / ${item.longitude}`}
                                >
                                    <Icon size={55} name={'md-pin'} style={styles.icon} />
                                    <Image
                                        source={{ uri: item.avatar }}
                                        style={styles.avatar}
                                    />
                                </Marker>
                            )
                        })
                    }
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        width: '100%',
        height: '100%'
    },
    icon: {
        // rotation: 180,

    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 100 / 2,
        position: 'absolute',
        marginLeft: 2,
        marginTop: 6,
    },
    indicatorUser: {
        width: '85%',
        height: 100,
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 4,
        padding: 10,
        marginBottom: 20,
        flexDirection: 'row'
    }
});
