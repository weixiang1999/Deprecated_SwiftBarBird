import React from 'react';
import { createSwitchNavigator,createAppContainer } from 'react-navigation';
import { AsyncStorage, StatusBar, View } from 'react-native';
import AppTabNavigator from './router';
import LoginScreen from './base/Index';
import InitScreen from './base/Init';
import Storage from 'react-native-storage';
import {Size,Mock,Tips,Confirm,ObjectClone} from '../tools/Normal';
import {Toast} from '@ant-design/react-native';
import Http from '../tools/Http';
import Service from '../tools/Service';
import CodePush from 'react-native-code-push';
const _ = require('lodash');
const storage = new Storage({
  // maximum capacity, default 1000
  size: 1000,
  storageBackend: AsyncStorage, 
  // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire
  defaultExpires: null,
  // cache data in the memory. default is true.
  enableCache: true,
  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {
    // we'll talk about the details later.
  }
});

global.storage = storage;
global.Http = Http;
global.Service = Service;
global._ = _;
global.ObjectClone = ObjectClone;
class AuthLoadingScreen extends React.Component
{
  componentDidMount()
  {
    //this.props.navigation.navigate('App');

    this.checkToken();
    CodePush.allowRestart();//在加载完了，允许重启
  }
  componentWillMount() {
    CodePush.disallowRestart();//禁止重启
    this.checkUpdate();
  }
  async checkUpdate() {
    if (!__DEV__) {
      CodePush.sync( {
        //安装模式
        //ON_NEXT_RESUME 下次恢复到前台时
        //ON_NEXT_RESTART 下一次重启时
        //IMMEDIATE 马上更新
        installMode : CodePush.InstallMode.IMMEDIATE ,
        //对话框
        updateDialog : {
          //是否显示更新描述
          appendReleaseDescription : true ,
          //更新描述的前缀。 默认为"Description"
          descriptionPrefix : "更新内容：" ,
          //强制更新按钮文字，默认为continue
          mandatoryContinueButtonLabel : "立即更新" ,
          //强制更新时的信息. 默认为"An update is available that must be installed."
          mandatoryUpdateMessage : "必须更新后才能使用" ,
          //非强制更新时，按钮文字,默认为"ignore"
          optionalIgnoreButtonLabel : '稍后' ,
          //非强制更新时，确认按钮文字. 默认为"Install"
          optionalInstallButtonLabel : '后台更新' ,
          //非强制更新时，检查到更新的消息文本
          optionalUpdateMessage : '有新版本了，是否更新？' ,
          //Alert窗口的标题
          title : '更新提示'
        } ,
      } ,
      );
    }
  }
  async checkToken()
  {
    const jwt = await AsyncStorage.getItem('token');
    if (jwt) {
      const res= await Http.get(Service.loginByJWT,{ jwt });
      console.log(res);
      if(res.status === 1) {
        const oldUserArray = await AsyncStorage.getItem('UserArray');
        if(oldUserArray) {
          const newUserArray = JSON.parse(oldUserArray);
          const index = newUserArray.findIndex(i => i.id === res.data.id);
          if(index > -1) {
              console.log('老用户');
          } else {
              console.log('新用户');
              newUserArray.push(res.data);
          }
          await AsyncStorage.setItem('UserArray', JSON.stringify(newUserArray));
          await AsyncStorage.multiSet(Object.keys(res.data).map(key => [ key, String(res.data[key]) ]));
        } else {
          await AsyncStorage.setItem('UserArray', JSON.stringify([]));
        }
        setTimeout(()=>{ this.props.navigation.navigate('App'); }, 2000);
      } else {
        Toast.info(res.message, 1);
        setTimeout(()=>{ this.props.navigation.navigate('Login'); }, 2000);      
      }
    }
    else {
      setTimeout(()=>{ this.props.navigation.navigate('Login'); }, 2000); 
    }
    // console.log(typeof(token));
  }


  render()
  {
    return(
      <View style={{flex:1}}>
      <StatusBar 
      hidden={true}
      barStyle={'dark-content'} //状态栏样式（黑字）
      />
      <InitScreen/>
      </View>

    )
  }
}




const AppNavigator=createSwitchNavigator(
  {
    AuthLoading:AuthLoadingScreen,
    App: AppTabNavigator,
    Login:LoginScreen,
  },
  {
    initialRouteName:'AuthLoading',
  }
  
);

export default AppContainer=createAppContainer(AppNavigator);