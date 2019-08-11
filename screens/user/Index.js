import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import TabBarIcon from '../../components/Common/TabBarIcon';
import MainScreen from './main';
import loginManageScreen from './loginManage';


const RootStack=createStackNavigator(
  {
    main:MainScreen,
    loginManage: loginManageScreen
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
  tabBarLabel: '我的',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};


export default RootStack;

