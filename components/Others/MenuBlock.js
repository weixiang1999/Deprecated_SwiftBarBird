import React from 'react';
import {View,TouchableOpacity,Text,StyleSheet,Alert} from 'react-native';
import {Icon} from 'react-native-elements'
import {Size} from '../../tools/Normal';

export default class extends React.Component
{
    onDisplay=true;
    constructor(props)
    {
        super(props);
    }
    render()
    {   

        if(this.onDisplay===true)
        {
            return(
            <TouchableOpacity underlayColor="#fff" onPress={()=>this.props.onPress()} activeOpacity={0.6}>
                <View style={styles.Block}>
                    <Icon name={this.props.icon.name} type={this.props.icon.type} size={48} color={this.props.color}/>
                    <View style={{marginTop:5}}>
                        <Text style={{color:'dimgray',fontSize:this.props.titleSize||15,fontWeight: '300',}}>{this.props.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            );
        }
        else
            return(<View></View>);
            
       
    }

}



const styles=StyleSheet.create({
    Block:
    {
        width:Math.floor(Size.width/3),
        height:Math.floor(Size.width/3),
        backgroundColor:"#fff",
        left:0,
        top:0,
        borderWidth: Size.pixel,
        borderColor:"#ccc",
        justifyContent:'center',
        alignItems: 'center',
    },
    font10:
    {
        color:'dimgray',
        fontSize:15,
        //width:Math.floor(Size.width/3),
        fontWeight: '500',
    },
    font18:
    {
        color:'#000',
        fontSize:18,
        fontWeight: '500',
    },
    font12:
    {
        color:'#000',
        fontSize:12,
        fontWeight: '500',
    },
})