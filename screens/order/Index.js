import React from 'react';
import {Platform, View} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import TabBarIcon from '../../components/Common/TabBarIcon';
import MainScreen from './main';
import OrderInfo from './OrderInfo';
import addOrder from './addOrder';


const RootStack=createStackNavigator(
  {
    main:MainScreen,
    orderinfo:OrderInfo,
    addOrder:addOrder,
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
  tabBarLabel: '订单',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-paper' : 'md-paper'}
    />
  ),
};


export default RootStack;

