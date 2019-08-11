import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import { Slider } from '@ant-design/react-native';
//已完成
/**

 */

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            selectedIndex:this.props.selectedIndex||0
        }
    }

   render()
    {
        return(
            <View style={{marginVertical:5}}>
               {
                   this.props.title?
                    <View style={{marginLeft:12,marginBottom:5}}>
                    <Text style={{fontSize:14,color:'#666666'}}>{this.props.title}</Text>
                    </View>
                        :
                    <View/>
                }
                
                <View style={{flexDirection:'row',}}>
                <Slider
                    min={this.props.min||1}
                    max={this.props.max||20}
                    step={1}
                    defaultValue={1}
                    styles={this.props.style}
                    onChange={(value)=>{
                        this.props.onValueChange(value);
                    }}
                />
                </View>
            </View>
            
            
        )
    }
}


