import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native';
import { Picker } from '@ant-design/react-native';

//已完成
/**

 */
const CustomChildren = props => (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          height: 39,
          marginLeft: 11,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor:'#DDDDDD',
          borderBottomWidth:0.5,
        }}
      >
        <Text style={{ textAlign: 'right', fontSize:15,color: '#000', marginRight: 15 }}>
          {props.extra}
        </Text>
      </View>
    </TouchableOpacity>
  );
/*
const data = [{
    value: '江西省',
    label: '江西省',
    children: [
        {
            value: '九江市',
            label: '九江市',
            children: [
                {
                    value: 'mk酒吧',
                    label: 'mk酒吧',
                },
                {
                    value: 'js酒吧',
                    label: 'js酒吧',
                }
            ]
        },
        {
            value: '南昌市',
            label: '南昌市',
            children: [
                {
                    value: 'xs酒吧',
                    label: 'xs酒吧',
                },
                {
                    value: 'qwe酒吧',
                    label: 'qwe酒吧',
                }
            ]
        }
    ]
},]
*/

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            value:[],
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
                    
                    <Picker
                    title={this.props.title}
                    onOk={v=>{console.log(v)}}
                    value={this.state.value}
                    onChange={(t)=>{
                    this.setState({value:t}); 
                    this.props.onValueChange(t);
                    }}
                    cols={this.props.col||1}
                    data={this.props.data.map(i=>({label:i,value:i}))}
                    cascade={true}
                    >
                    <CustomChildren/>
                    </Picker>
                </View>
            </View>
            
            
        )
    }
}
