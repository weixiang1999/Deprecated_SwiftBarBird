import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import PropTypes from 'prop-types';
//已完成
/**
https://github.com/n4kz/react-native-material-dropdown
//
  <DropDown
    label='选择地点'
    content={[1,2,3]}
    onValueChange={(value)=>{console.log(value)}}
    placeholder='选择'

    />
 */

export default class extends React.Component
{
   render()
    {
        return(
           <View style={{margin:5,paddingHorizontal:5,marginTop:this.props.label?5:-10}}>
           {
               this.props.label? <View style={{marginBottom:-15}}>
               <Text style={{color:'#666666'}}>{this.props.label}</Text>
             </View>:null
           }
                 
                  <View >
                    <Dropdown
                        overlayStyle={{height:20}}
                        label={this.props.placeholder}
                        animationDuration={50}
                        data={this.props.content.map(i=>({value:i}))}
                        onChangeText={(value)=>
                        {
                            this.props.onValueChange(value);
                        }}
                        />
                  </View>
           </View>
            
        )
    }
}
