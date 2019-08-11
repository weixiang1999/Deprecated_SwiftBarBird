import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import { PickerView } from '@ant-design/react-native';
//已完成
/**

 */
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            value:[]
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
                
                <View style={{}}>
                <PickerView
                onChange={(value)=>{this.setState({value:value});this.props.onValueChange(value)}}
                value={this.state.value}
                cols={this.props.cols||1}
                data={this.props.data}
                cascade={false}
                />
                </View>
            </View>
            
            
        )
    }
}
