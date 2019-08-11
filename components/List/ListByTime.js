import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
var moment = require('moment');
/*
已完成
const renderItem=(item)=><OrderItem item={item} onPress={()=>{this.props.navigation.navigate('orderinfo')}}/>

return <ListByTime
        time={new Date()}
        list={this.state.list}
        renderItem={renderItem}
        />;


List(date,listPerDay){
    const listItem = (item) =>
    {
        return(
            <TouchableOpacity activeOpacity={0.2} onPress={()=>{}}>
                <View style={styles.box}>
                    <View style={styles.left}>
                        <Text style={{fontSize:15,fontWeight:'200'}}>{item.content}</Text>
                        <View style={{marginVertical:2}}/>
                        <Text style={{fontSize:11,fontWeight:'200',color:'gray'}}>{item.content}</Text>
                    </View>
                    <View style={styles.right}>
                        <Icon name={'edit'} color={'#FFD700'} type={'feather'} size={22}/>
                        <View style={{marginHorizontal:7}}/>
                        <Icon name={'trash-2'} color={'orangered'} type={'feather'} size={22}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderItem = (item)=>
        listItem(item)
        
    return <ListByTime
            date={date}
            list={listPerDay}
            renderItem={renderItem}
            />;
}
*/


const styles=StyleSheet.create({
    left:{
        flex:3,
        //backgroundColor:'red',
        alignItems: 'center',
        paddingTop:10
        
    },
    right:{
        flex:14,
        paddingTop:10,
    },
});
const weekday=[
    'Sun','Mon','Tue','Wed','Thu','Fri','Sat',
]
export default class extends React.Component
{

    render()
    {
        const list=this.props.list;//array
        const Item=this.props.renderItem;//func
        console.log('实际渲染');
        console.log(list);
        const Time=moment(this.props.date, 'YYYY-MM-DD');//Date
        const color=Time.dates()===moment().date()&&Time.month()===moment().month()?'deepskyblue':'gray';
        const List= 
            <View style={{marginHorizontal:5,marginTop:5,flexDirection:'row'}}> 
                <View style={styles.left}>
                    <View style={{marginBottom:-5}}>
                        <Text style={{color:color,fontSize:this.props.timeSize||23,fontWeight:'200'}}>
                            {(Time.month()+1)+'-'+Time.date()}
                        </Text>
                    </View>
                    <Text  style={{color:color,fontSize:this.props.timeSize-5||18,fontWeight:'200'}}>
                        {weekday[Time.day()]}
                    </Text>
                </View>
                <View style={styles.right}>
                    {list.map(item=>Item(item))}
                </View>
            </View>;
        return List;
    }
}
