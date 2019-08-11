import React from 'react';
import {StyleSheet,View,TouchableOpacity} from 'react-native';
import {Text,Icon} from 'react-native-elements';
import {Icon as IconA,WhiteSpace} from '@ant-design/react-native';
var _ = require('lodash');
var moment = require('moment');
import Circle from '../Shape/Circle';

/*
{
    id:'',
    status:'',
    created_time:'19:20',
    phone:'',
}
*/
const Color = {
    '预定中':'#FF88C2',
    '待接受':'#00BBFF',
    '待跟进':'#FFBB00',
    '已跟进':'#00DDAA',
    '已完成':'#00DD00',
    '已取消':'#AAAAAA',
    '待修改':'#FF7744',
    '已修改':'#FF8888',
    '待联系':'#FFD700',
    '待接到':'tomato',
};

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    tip(tip,color = 'green') {
        return(
            <View style={{paddingHorizontal:3,height:20,marginHorizontal:2,borderColor:color,borderRadius:5,borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:color,fontSize:12,fontWeight:'200'}}>
                    {tip}
                </Text>
            </View>
        )
    }
    TimeTip(item) {
        const format = time => moment(time).format('HH:mm');
        const tip = {
            '待跟进': '接到客户于' + format(item.arrived_time),
            '已跟进': '跟进于' + format(item.followed_time),
            '已完成': '完成于' + format(item.finished_time),
            '已取消': '取消于' + format(item.cancelled_time), 
            '待修改': '接受于' + format(item.accepted_time),
            '已联系': '接受于' + format(item.accepted_time),
            '待接到': '联系于' + format(item.contacted_time),
        };
        return tip[item.order_status] || '创建于' + format(item.created_time);
    }
    render()
    {
        const { user_type, bar_name } = this.props.item;
        console.log(this.props);
        const circle=
            <Circle size={55} color={Color[this.props.item.order_status]}>
                <Text style={{fontSize:13,textAlign:'center',color:'#fff',fontWeight:'200'}}>{this.props.item.order_status}</Text>
            </Circle>;
        return(
                <TouchableOpacity activeOpacity={0.2} onPress={()=>{this.props.onPress(this.props.item.id)}}>
                    <View style={{marginBottom:5,borderRadius:5,backgroundColor:'#fff',height:100,flexDirection:'row'}}>
                    <View style={{flex:3,paddingLeft:30,justifyContent:'center',paddingVertical:20}}>
                        <Text style={{fontSize:22,fontWeight:'200'}}>{this.props.item.customer_name}</Text>
                        <WhiteSpace/>
                        <Text style={{fontSize:user_type?14:12,fontWeight:'200',color:'gray'}}>{this.props.item.customer_phone+' '}</Text>
                        {
                            user_type? 
                            <Text style={{fontSize:12,fontWeight:'200', color:'orange'}}>{bar_name}</Text>
                            : null
                        }
                        <Text style={{fontSize:14,fontWeight:'200',color:'gray'}}>{this.TimeTip(this.props.item)}</Text>
                    </View>
                    <View style={{flex:2,alignItems:'center',paddingTop:10,paddingRight:10,alignItems:'flex-end'}}>
                        {circle}
                        <View style={{flexDirection:'row',marginVertical:5}}>
                        {
                            this.props.tips.map(i=> i ? this.tip(i.tip, i.color) : null )
                        }
                        </View>        
                    </View>
                </View>
                </TouchableOpacity>
           
        )
    }
}
