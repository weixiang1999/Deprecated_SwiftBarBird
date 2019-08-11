import { Platform, PixelRatio, Dimensions, Linking } from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import {StatusBar} from 'react-native';
import { Modal, ActionSheet as AS } from "@ant-design/react-native";
import GetContact from './GetContact';
export function DateToYMD(time)
{
    if(time!==null)
    {
       let date=new Date(time);
       return (date.getMonth() + 1) + '-' +date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes());
    }
    else
    {
       return '无'
    }
}

export const Confirm = (func,message) => {
   Modal.alert('提示', message||'确认操作吗？', [
      {
        text: '取消',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      { text: '确定', 
        onPress: () => {
          func();
        } 
      },
    ]);
}
export const Tips = (message, func = () => {}) => {
   Modal.alert('提示', message , [
      {
        text: '确认',
        onPress: () => { func() },
        style: 'cancel',
      },
    ]);
    return true;
}

export const ActionSheet = (message,options) => {
   const BUTTONS = [
      ...options.map(i => i.title),
      '取消',
    ];
   // console.log(BUTTONS);
   AS.showActionSheetWithOptions(
   {
      title: '提示',
      message,
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length-1,
   },
   buttonIndex => {
      console.log(buttonIndex);
      if(buttonIndex < options.length)
      {
         options[buttonIndex].onPress();
      }
   }
   );
}
export const Size =
{
   width: Dimensions.get('window').width,
   height: Platform==='ios'?
   Dimensions.get("window").height:
   Dimensions.get("window").height-StatusBar.currentHeight-60,
   ratio: PixelRatio.get(),
   pixel: 1 / PixelRatio.get(),
}   


export const Mock = (body,time=2000) =>{
   return new Promise((resolve,reject)=>{
       setTimeout(()=>{
           resolve(body);
       },time);
   });
}


export const SecondToDate = (result) => {
   var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
   var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
   var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
   return result = h + ":" + m + ":" + s;
}
/**
 * 根据某个属性的值归并
 * @param {String} key
 * @param {Object[]} data
 */

export const ClassifyByKey = (data,key,trans = i => String(i) ) => {
   let list = {};
   data.forEach((i,index) => {
      let value = i[String(key)];
      if(Object.keys(list).indexOf(trans(value)) === -1) {
            list[trans(value)]=[];
            list[trans(value)].push(i);
      } else {
            list[trans(value)].push(i);
      }
   });
   return list;
}
/**
 * @param {Object} object
 * 
 */
export const Object2Array = (object) => {
   return Object.keys(object).map(key => ({
      key: key,
      value: object[key] 
   }))
}

export const ObjectClone = (object) => {
   return JSON.parse(JSON.stringify(object));
}

export const linking= (url)=>{
   Linking.canOpenURL(url).then(supported => {
       if (!supported) {
           // console.log('Can\'t handle url: ' + url);
       } else {
           return Linking.openURL(url);
       }
   }).catch(err => console.error('An error occurred', err));

}

export const GetCurrentContact = () => {
   return new Promise((resolve,reject) => {
      GetContact.getCallLogs('hello',(text)=>{
         console.log('返回的数据为');
         console.log(text);
         if (text !== 'null') {
            // console.log(text);
            const array = text.map(i => JSON.parse(i));
            console.log(array);
            resolve(array);
         } else {
            resolve(null);
         }
      });
   });
}