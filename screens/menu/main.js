import React from 'react';
import {StyleSheet,View} from 'react-native';
import Block from '../../components/Others/MenuBlock';
import {Header} from 'react-native-elements';
export default class extends React.Component
{
    static navigationOptions = {
        title:'功能表',
        
      };
    constructor(props)
    {
        super(props);
    }
    List = [
    {
        title:'联系人',
        color:'#33CCFF',
        icon:{name:'md-people',type:'ionicon',},
        titleSize:15,
        onPress:()=>{this.props.navigation.navigate('staffmanager')}
    },
    {
        title:'订单日历',
        color:'#FFDD55',
        icon:{name:'md-calendar',type:'ionicon',},
        titleSize:15,
        onPress:()=>{this.props.navigation.navigate('calendar')}
    },
    /*
    {
        title:'订单查询',
        color:'#FF7744',
        icon:{name:'md-search',type:'ionicon',},
        titleSize:15,
        onPress:()=>{this.props.navigation.navigate('findorder')}
    },*/
    {
        title:'门店套餐管理',
        color:'#FF8800',
        icon:{name:'box',type:'feather',},
        titleSize:12,
        onPress:()=>{this.props.navigation.navigate('packagemanage')}
    },
    {
        title:'门店信息管理',
        color:'gray',
        icon:{name:'md-business',type:'ionicon',},
        titleSize:12,
        onPress:()=>{this.props.navigation.navigate('barinfomanage')}
    },
    {
        title:'公告板',
        color:'#00AA88',
        icon:{name:'md-browsers',type:'ionicon',},
        titleSize:15,
        onPress:()=>{this.props.navigation.navigate('announcement')}
    },
    {
        title:'记账板',
        color:'#D28EFF',
        icon:{name:'md-clipboard',type:'ionicon',},
        titleSize:15,
        onPress:()=>{this.props.navigation.navigate('accounts')}
    },
    
    ]
    render()
    {
        return (
        <View style={{flex:1}}>
            <View style={styles.container}>
            {
                this.List.map((item)=>
                <Block
                title={item.title}
                color={item.color}
                icon={item.icon}
                titleSize={item.titleSize}
                onPress={item.onPress}
                />)
            }
            </View>
        </View>
        )
    }

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        flexDirection:'row',
        flexWrap:'wrap',
    }
})