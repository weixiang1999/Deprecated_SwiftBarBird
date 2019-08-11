import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native';
import { Picker,List } from '@ant-design/react-native';
const data = require('@bang88/china-city-data');
//已完成
/**

 */
//console.log(data);
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
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            value:undefined
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
                    data={data}
                    cols={2}
                    value={this.state.value}
                    onChange={(t)=>{this.setState({value:t}); 
                    let a=[data.filter(i=>i.value===t[0])[0]];
                    a[1]=a[0].children.filter(i => i.value===t[1])[0];
                    this.props.onValueChange(a);
                    }}
                    >
                    <CustomChildren></CustomChildren>
                    </Picker>
                </View>
            </View>
            
            
        )
    }
}
