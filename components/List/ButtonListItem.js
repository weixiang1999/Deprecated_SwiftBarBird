import React from 'react';
import {StyleSheet,View,TouchableOpacity} from 'react-native';
import {Size} from '../../tools/Normal';
import {Text,Icon} from 'react-native-elements';
import {Icon as IconA,WhiteSpace} from '@ant-design/react-native';
/*

*/
const styles=StyleSheet.create({
    Container:
    {
        height:50,
        backgroundColor:'#fff',
        borderTopColor: '#ccc',
        borderBottomColor: "#ccc",
        borderTopWidth: Size.pixel,
        borderBottomWidth: Size.pixel,
        flexDirection:'row',
    },
    left:{
        flex:1,
        padding:13,
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:'center'
    },
    right:{
        flex:1,
        padding:10,
        paddingRight: 14,
        alignItems: 'flex-end',
        justifyContent:'space-around'
    },
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

                <TouchableOpacity activeOpacity={0.2} onPress={this.props.onPress}>
                    <View style={styles.Container}>
                        
                        <View style={styles.left}>
                            <Icon name={this.props.icon} color={this.props.color} type={this.props.type} size={22}/>
                            <View style={{marginHorizontal:7}}/>
                            <Text style={{fontSize:14,fontWeight:'200'}}>{this.props.title}</Text>
                        </View>
                        <View style={styles.right}>
                        <IconA  name={'right'} size={18}/>
                        </View>
                    </View>
                </TouchableOpacity>
           
        )
    }
}
