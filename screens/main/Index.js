import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import TabBarIcon from '../../components/Common/TabBarIcon';
import MainScreen from './main';



const RootStack=createStackNavigator(
  {
    main:MainScreen,
  },
  {
    initialRouteName:'main',
    defaultNavigationOptions: 
    {
      headerStyle:
      {
        backgroundColor:'#F5F5F5',
      },
      headerTintColor:'#000000',
      headerTitleStyle:{
        alignSelf:'center',
        textAlign: 'center',
        fontWeight:'200',
        fontSize:15,
        flex:1,
      },
    }
  }
);

RootStack.navigationOptions = {
  tabBarLabel: '首页',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-home'
          : 'md-home'
      }
    />
  ),
  
};


export default RootStack;


