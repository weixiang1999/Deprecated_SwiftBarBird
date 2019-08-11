import React from 'react';
import { StyleSheet, View, Image} from 'react-native';
import {Size} from '../../tools/Normal';
import * as Animatable from 'react-native-animatable';

export default class extends React.Component{
  render()
  {
    return(
      <View style={styles.container}>
        <StatusBar 
        backgroundColor={'#eae9f1'} //状态栏背景颜色
        barStyle={'dark-content'} //状态栏样式（黑字）
        />
       <Animatable.View animation='fadeIn' style={{flex:1,justifyContent:'center'}}>
          <View style={{marginTop:0.7*Size.height,paddingHorizontal:0.2*Size.width,height:0.35*Size.width,flexDirection:'row',}}>
            <View style={{flex:3,alignItems:'center',}}>
              <Image source={require('../../assets/img/logo.png')} style={styles.logo} />
            </View>
            <View style={{flex:5,alignItems:'center',marginLeft:-0.1*Size.width}}>
              <Image source={require('../../assets/img/logo-font.png')} style={styles.title} />
              <Image source={require('../../assets/img/logo_tips.png')} style={styles.tip} />
            </View>
          </View> 
       </Animatable.View>
      </View>
    )
  }
}



const styles=StyleSheet.create
({
  container:
  {
    flex:1,
    backgroundColor:'#ffffff'
  },
  spinner: {
    marginBottom: 50
  },
  logo:{
    marginTop:0.06*Size.height,
    width:0.15*Size.width,
    height:0.15*Size.width,
    borderRadius:10,
  },
  title:{
    //marginLeft:0.05*Size.width,
    marginTop:0.064*Size.height,
    width:0.3*Size.width,
    height:0.18*Size.width,
  },
  tip:{
    //marginLeft:0.05*Size.width,
    marginTop:-0.09*Size.width,
    width:0.3*Size.width,
    height:0.1*Size.width,
  }
});


