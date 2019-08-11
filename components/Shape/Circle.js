import React from 'react';
import {View,StyleSheet,Text} from 'react-native';

/*
已完成

*/

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
    }
   render()
    {
        const { size,color,style } = this.props;
        return(
            <View style={{
                alignItems:'center',
                justifyContent:'center',
                width: size,
                height:size,
                backgroundColor: color,
                borderColor:'green',
                borderStyle:'solid',
                borderRadius:50,
                paddingBottom:2,
                ...style,
            }}>
                {this.props.children}
            </View>
  
        )
    }
}
