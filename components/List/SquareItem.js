import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
/*
已完成
<SquareItem
title={item.content}
titleSize={}
subtitleSize={}
onPress={()=>{}}
gap={10}
subtitle={item.content}
buttonList={
    [
        {
            name:'edit',
            type:'feather',
            color:'#FFD700',
            onPress:()=>{}
        },
        {
            name:'trash-2',
            type:'feather',
            color:'orangered',
            onPress:()=>{}
        },

    ]
}
/>
*/

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
    }

   render()
    {
        const styles= {
            box:{
                borderRadius:5,
                backgroundColor:'#fff',
                height:50,
                flexDirection:'row'
            },
            left:{
                flex:1,
                paddingLeft:30,
                paddingVertical:10,
                justifyContent:'center',
            },
            right:{
              
                paddingRight:15,
                flexDirection:'row',
                justifyContent:'flex-end',
                alignItems: 'center',
            }
        }
        return(
            <TouchableOpacity activeOpacity={this.props.onPress?0.2:1} onPress={()=>{this.props.onPress?this.props.onPress():null}}>
            <View style={ { ...styles.box, marginTop:5,...this.props.style} }>
                <View style={styles.left}>
                    <Text style={{fontSize:this.props.titleSize||15,fontWeight:'200'}}>{this.props.title}</Text>
                    {
                        this.props.subtitle1?
                        (
                            <View>
                                <View style={{marginVertical:1}}/>
                                <Text style={{fontSize:this.props.subtitleSize||12,fontWeight:'200',color:'orange'}}>
                                {String(this.props.subtitle1)}
                                </Text>
                            </View>
                        )
                        :null
                    }
                    {
                        this.props.subtitle?
                        (
                            <View>
                                <View style={{marginVertical:1}}/>
                                <Text style={{fontSize:this.props.subtitleSize||12,fontWeight:'200',color:'gray'}}>
                                {String(this.props.subtitle)}
                                </Text>
                            </View>
                        )
                        :null
                    }
                    
                </View>
                <View style={styles.right}>
                    {
                        this.props.buttonList.map((i)=>{
                            return(
                                <View style={{marginLeft:this.props.gap||7}}>
                                    <TouchableOpacity onPress={()=>{i.onPress()} }> 
                                        <Icon name={i.name} color={i.color} type={i.type} size={22}/>
                                    </TouchableOpacity>
                                </View>
                                
                                
                            )
                        })
                    }
                </View>
            </View>
            </TouchableOpacity>
        )
    }
}
