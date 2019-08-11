import React from 'react';
import {StyleSheet,View,TouchableOpacity,Text, } from 'react-native';
import { Size } from '../../tools/Normal';
/**
  <InfoItem 
  label={'姓名'} 
  value={'魏祥'} 
  labelStyle={{color:'orange'}} 
  valueStyle={{color:'red'}}
  onPress={()=>{}}
  />
 */
const styles=StyleSheet.create({
    Container:
    {
        height:40,
        borderBottomColor: "#ccc",
        borderBottomWidth:Size.pixel,
        borderTopColor: "#ccc",
        borderTopWidth:Size.pixel,
        flexDirection:'row',
        marginHorizontal:10,
        paddingHorizontal:30,
    }
});
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
    }

   render()
    {
        return(
           <View style={styles.Container}>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>

                <Text style={{fontSize:15,fontWeight:'200',color:'#000',...this.props.labelStyle}}>
                    {this.props.trans===true?Trans[this.props.trans]:this.props.label}
                </Text>
                </View>
                {
                    this.props.onPress?
                    <TouchableOpacity onPress={this.props.onPress}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <Text style={{fontSize:15,fontWeight:'200',color:'gray',...this.props.valueStyle}}>
                            {this.props.value}
                        </Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <Text style={{fontSize:15,fontWeight:'200',color:'gray',...this.props.valueStyle}}>
                        {this.props.trans ? this.props.trans(this.props.value) : this.props.value}
                    </Text>
                    </View>

                }
               
           </View>   
        )
   }
}
