import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer, createSwitchNavigator } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import mainScreen from '../screens/mainScreen';

const defaultStackNavOptions = {
  headerStyle: {
    // backgroundColor: Platform.OS === 'android' ? colors.backgroundColor : colors.backgroundColor,
    shadowColor: 'transparent',
  },
  // headerTintColor: Platform.OS === 'android' ? colors.primaryTextColor : colors.primaryTextColor,
};


const AppNavigator = createBottomTabNavigator({
  Building: {
    screen: createStackNavigator({
      Building: {
        screen: mainScreen,
        navigationOptions: ({ screenProps }) => ({
          headerTitle: (screenProps.language === 'en') ? 'Building' : 'Bygning',
        }),
      },
    }, {
      defaultNavigationOptions: defaultStackNavOptions,
    }),
    navigationOptions: ({ screenProps }) => ({
      tabBarLabel: (screenProps.language === 'en') ? 'Building' : 'Bygning',
      tabBarIcon: (tabInfo) => <Ionicons name="ios-business" size={30} color={tabInfo.tintColor} />,
    }),
  },
  // Feed: {
  //   screen: createStackNavigator({
  //     FeedScreen: {
  //       screen: FeedScreen,
  //       navigationOptions: {
  //         headerTitle: 'Feed',
  //       },
  //     },
  //   }, {
  //     defaultNavigationOptions: defaultStackNavOptions,
  //   }),
  //   navigationOptions: {
  //     tabBarLabel: 'Feed',
  //     tabBarIcon: (tabInfo) => <Ionicons name="ios-square-outline" size={30} color={tabInfo.tintColor} />,
  //   },
  // },
  // Prices: {
  //   screen: createStackNavigator({
  //     PriceMarket: {
  //       screen: PriceMarketScreen,
  //       navigationOptions: ({ screenProps }) => ({
  //         headerTitle: (screenProps.language === 'en') ? 'Prices' : 'Priser',
  //       }),
  //     },
  //   }, {
  //     defaultNavigationOptions: defaultStackNavOptions,
  //   }),
  //   navigationOptions: ({ screenProps }) => ({
  //     tabBarLabel: (screenProps.language === 'en') ? 'Prices' : 'Priser',
  //     tabBarIcon: (tabInfo) => <Ionicons name="md-analytics" size={30} color={tabInfo.tintColor} />,
  //   }),

  // },
  // Invoices: {
  //   screen: InvoicesNavigator,
  //   navigationOptions: ({ screenProps }) => ({
  //     tabBarLabel: (screenProps.language === 'en') ? 'Invoices' : 'Faktura',
  //     tabBarIcon: (tabInfo) => <Ionicons name="ios-mail" size={25} color={tabInfo.tintColor} />,
  //   }),
  // },
  // Home: {
  //   screen: createStackNavigator({
  //     InvoicesScreen: {
  //       screen: HomeScreen,
  //       navigationOptions: ({ screenProps }) => ({
  //         headerTitle: (screenProps.language === 'en') ? 'My home' : 'Min bolig',
  //       }),
  //     },
  //   }, {
  //     defaultNavigationOptions: defaultStackNavOptions,
  //   }),
  //   navigationOptions: ({ screenProps }) => ({
  //     tabBarLabel: (screenProps.language === 'en') ? 'My home' : 'Min bolig',
  //     tabBarIcon: (tabInfo) => <Ionicons name="ios-home" size={30} color={tabInfo.tintColor} />,
  //   }),
  // },
  // Profile: {
  //   screen: ProfileNavigator,
  //   navigationOptions: ({ screenProps }) => ({
  //     tabBarLabel: (screenProps.language === 'en') ? 'My profile' : 'Min profil',
  //     tabBarIcon: (tabInfo) => <Ionicons name="person-circle-outline" size={30} color={tabInfo.tintColor} />,
  //   }),
  // },
}, {
  defaultNavigationOptions: defaultStackNavOptions,
  tabBarOptions: {
    activeTintColor: 'red',
    style: {
      backgroundColor: 'white',
    },
  },

});
export default createAppContainer(createSwitchNavigator(
  {
    Startup: mainScreen,
    Main: AppNavigator,
  },
  {
    initialRouteName: 'Startup',
  },
));
