import React from 'react';
import {Platform, View, StatusBar} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import TabBarIcon from '../../components/Common/TabBarIcon';
import MainScreen from './main';
import Calendar from './Calendar';
import Accounts from './Accounts';
import FindOrder from './FindOrder';
import StaffManager from './StaffManage';
import UserInfo from './UserInfo';
import BarInfoManage from './BarInfoManage';
import BarInfo from './BarInfo';
import PackageManage from './PackageManage';
import Announcement from './Announcement';
import OrderInfo from '../order/OrderInfo';
const RootStack=createStackNavigator(
  {
    main:MainScreen,
    calendar:Calendar,
    accounts:Accounts,
    findorder:FindOrder,
    staffmanager:StaffManager,
    userinfo:UserInfo,
    barinfomanage:BarInfoManage,
    barinfo:BarInfo,
    packagemanage:PackageManage,
    announcement:Announcement,
    orderinfo: OrderInfo,
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
  tabBarLabel: '功能',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-grid' : 'md-grid'}
    />
  ),
  
};


export default RootStack;
