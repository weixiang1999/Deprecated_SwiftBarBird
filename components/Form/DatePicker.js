import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { DatePicker } from '@ant-design/react-native';
import moment from 'moment';
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
        this.state = {
        };
    }

   render()
    {
        return(
            <View style={this.props.style}>
                <View style={{marginLeft:12,marginTop:5,marginBottom:0}}>
                    <Text style={{fontSize:14,color:'#666666'}}>{this.props.title}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                <DatePicker
                value={this.state.value}
                mode="datetime"
              
                minDate={new Date()}
                maxDate={new Date(2030, 10, 1)}
                onChange={(time) => {
                    this.setState({ value: time});
                    this.props.onValueChange(time);
                }}
                format="YY-MM-DD HH:mm"
                >
                 <CustomChildren></CustomChildren>
                </DatePicker>
                </View>
            </View>
        );

    }
}


