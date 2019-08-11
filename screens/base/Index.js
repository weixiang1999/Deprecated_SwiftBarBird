import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import LoginScreen from './Login';



const RootStack=createStackNavigator(
  {
    Login:LoginScreen,
  },
  {
    initialRouteName:'Login',
    defaultNavigationOptions: 
    {
      headerStyle:
      {
        backgroundColor:'#F5F5F5',
      },
      headerTitleStyle:{
        alignSelf:'center',
        textAlign: 'center',
        flex:1,
      },
      headerTintColor:'#000000',
      header:null,
      
    },
  }
);



export default RootStack;


