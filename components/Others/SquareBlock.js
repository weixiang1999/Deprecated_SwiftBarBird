import React from 'react';
import {View,TouchableHighlight,Text,StyleSheet,Alert} from 'react-native';
import {Icon} from 'react-native-elements'
import Tools from '../util/tools';




export default class extends React.Component
{
    onDisplay=true;
    constructor(props)
    {
        super(props);
    }
    render()
    {   
        const buttonstyle=
        {
            width:Math.floor(((Tools.size.width-20)-4*5*2)/4),
            height:Math.floor(((Tools.size.width-20)-4*5*2)/4),
            backgroundColor:this.props.backgroundColor
        }
        if(this.props.onDisplay===true)
        {
            return(
            <TouchableHighlight underlayColor="#fff" onPress={this.props.onPress} activeOpacity={0.5}>
                <View style={[styles.Block,buttonstyle]}>
                    <Icon name={this.props.icon.name} type={this.props.icon.type} size={35} color='#fff'/>
                    <View style={{marginTop: 5,}}>
                        <Text style={styles.font12}>{this.props.title}</Text>
                    </View>
                    <View style={{marginTop:5}}>
                        <Text style={styles.font10}>{this.props.subtitle}</Text>
                    </View>
                </View>
            </TouchableHighlight>
            );
        }
        else
            return(<View></View>);
            
       
    }

}



const styles=StyleSheet.create({
    Block:
    {
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal:5,
        paddingTop:23
    },
    font10:
    {
        color:'#fff',
        fontSize:10,
        fontWeight: '500',
    },
    font18:
    {
        color:'#fff',
        fontSize:18,
        fontWeight: '500',
    },
    font12:
    {
        color:'#fff',
        fontSize:12,
        fontWeight: '500',
    },
})