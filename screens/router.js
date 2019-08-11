import React from 'react';
import {createBottomTabNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import MainStack from '../screens/main/Index';
import OrderStack from '../screens/order/Index';
import MenuStack from '../screens/menu/Index';
import UserStack from '../screens/user/Index';
import Color from '../constants/Colors';


export default BottomTab=createBottomTabNavigator
(
  {
    Home:MainStack,
    Order:OrderStack,
    Menu:MenuStack,
    User:UserStack,
  },
  {
    initialRouteName:'Home',
    tabBarOptions: { 
      activeTintColor: Color.tabIconSelected,
      inactiveTintColor: Color.tabIconDefault,
      style:{
        backgroundColor:'#F5F5F5'
      }
    },
    defaultNavigationOptions: 
    {
      headerStyle:
      {
        backgroundColor:'#F5F5F5',
      },
      headerTintColor:'#000000',
      headerTitleStyle: {
        fontWeight: '200',
      },
      tabBarOnPress:({navigation,defaultHandler}) => {            
        StatusBar.setBarStyle('dark-content',true);
        Platform.OS == 'android' ? 
        StatusBar.setBackgroundColor('#f5f5f5',true):'';
        //背景颜色是透明            
        // Platform.OS == 'android'?StatusBar.setTranslucent(true):'';//设置状态栏透明            
        defaultHandler();//导航的默认行为，比如说标签导航下面的图标与颜色选中与未选中颜色的不同}}
      },
    }
    
  }
);


