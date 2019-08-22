import React from 'react'
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from 'react-native-vector-icons/Ionicons';

//import screen
import Home from '../screens/Home'
import Login from '../screens/Login'
import Nearby from '../screens/Nearby'
import FriendList from '../screens/FriendList'
import FriendProfile from '../screens/FriendProfile'
import Profile from '../screens/Profile'
import PersonalChat from '../screens/PersonalChat'
import SplashScreen from '../screens/SplashScreen'
import Register from '../screens/Register'
import Tes from '../screens/tesupload'

const BottomNavigator = createMaterialBottomTabNavigator({
    // Home: {
    //     screen: Home,
    //     navigationOptions: {
    //         tabBarIcon: ({ tintColor }) => (
    //             <Icon size={30} name={'md-home'} style={{ color: tintColor }} />
    //         )
    //     }
    // },
    Nearby: {
        screen: Nearby,

        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon size={30} name={'md-map'} style={{ color: tintColor }} />
            )
        },
    },
    Friend: {
        screen: FriendList,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon size={30} name={'md-contacts'} style={{ color: tintColor }} />
            )
        },
    },
    Profile: {
        screen: Profile,

        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon size={30} name={'md-contact'} style={{ color: tintColor }} />
            )
        },
    }
},
    {
        initialRouteName: 'Nearby',
        activeColor: 'green',
        inactiveColor: '#777',
        barStyle: { backgroundColor: '#fefefe' },
    });

const AppStack = createStackNavigator({
    Home: {
        screen: BottomNavigator,
        navigationOptions: {
            header: null,
        }
    },
    PersonalChat: {
        screen: PersonalChat,
        navigationOptions: {
            header: null,
        }
    },
    FriendProfile: {
        screen: FriendProfile
    },
    Tes: {
        screen: Tes
    }
});


export default createAppContainer(createSwitchNavigator(
    {
        SplashScreen: SplashScreen,
        Login: Login,
        Register: Register,
        Home: AppStack
    },
    {
        initialRouteName: 'SplashScreen',
    }
));

