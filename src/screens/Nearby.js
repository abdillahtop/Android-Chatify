import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Image, AsyncStorage, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import GetLocation from 'react-native-get-location'
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import { Database } from '../config/firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatar: props.navigation.getParam('avatar'),
            name: props.navigation.getParam('name'),
            phone: props.navigation.getParam('phone'),
            mapRegion: null,
            latitude: 0,
            longitude: 0,
            users: [],
            myid: '',
            allData: ''
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
        Database.ref('/users').orderByChild('id').equalTo(this.state.myid).once('value', (result) => {
            Database.ref('/users/' + this.state.myid).update({ latitude: this.state.latitude, longitude: this.state.longitude })
        })
    }

    componentWillMount = async () => {
        let dbRef = firebase.database().ref('users');
        let myid = await AsyncStorage.getItem('userid');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            this.setState((prevState) => {
                return {
                    allData: [...prevState.allData, person]
                }
            })
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
                console.warn(code, message);
            })
    }

    render() {
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
                            return (
                                <Marker
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                    }}
                                    title={item.name}
                                    description={`${item.latitude} / ${item.longitude}`}
                                    onPress={() => this.props.navigation.navigate('FriendProfile', item)}
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
