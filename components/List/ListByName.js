import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements';
/*
已完成
 List=[
        {
            title:'苏荷酒吧',
            subtitle1:'江苏 南京',
            subtitle2:'',
            data:[
                {
                    name:'炸鸡套餐',
                    price:'998'
                },
            ]
        },
    ]
this.state.List.map(bar=>
    <ListByName
    buttonList={[{
        name:'plus',
        color,
        title:
        onPress
    }]}
    list={bar}
    renderItem={(item)=>this.listItem_ListByTime(item)}
/>
*/


const styles=StyleSheet.create({
    left:{
        flex:4,
        //backgroundColor:'red',
       //alignItems: 'center',
        paddingTop:10,
    },
    right:{
        //backgroundColor:'red',
        flex:14,
        paddingTop:6,
    },
});
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.timeColor=this.props.color||'#000';//string
        this.list=this.props.list;//array
        this.Item=this.props.renderItem;//func
    }

    IconButton(name,type,color,onPress=()=>{},size,title) {
        return (
            <TouchableOpacity 
            style={{ 
                paddingHorizontal: 5, 
                marginBottom: 5, 
                borderWidth: 1,
                borderColor: color,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
            }} 
            onPress={()=>{ onPress() }}>
            <Icon name={name||'plus'} color={color||'#FF8800'} type={type||'feather'} size={size||25}/>
            <Text style={{fontWeight:'200', color}}>
                {title}
            </Text>
            </TouchableOpacity>
        )
    }
   render()
    {
        const List= 
        <View style={{marginHorizontal:5,marginTop:5,flexDirection:'row'}}> 
            <View style={styles.left}>
                <View style={{marginBottom:5}}>
                    <Text style={{color:'#000',fontSize:15,fontWeight:'200'}}>
                        {this.list.title}
                    </Text>
                </View> 
            
                <Text  style={{color:'#000',fontSize:12,fontWeight:'200',color:'gray'}}>
                    {this.list.subtitle1}
                </Text>
                <Text  style={{color:'#000',fontSize:12,fontWeight:'200',color:'gray'}}>
                    {this.list.subtitle2}
                </Text>
                <View style={{paddingTop:10,flexWrap:'wrap',flexDirection:'row'}}>
                    {this.props.buttonList?this.props.buttonList.map(i => this.IconButton(i.name,i.type,i.color,i.onPress,i.size,i.title)):null}
                </View>
            </View>
            <View style={styles.right}>
            
                {   
                    (this.list.data&&this.list.data.length!==0)?
                    this.list.data.map(item=>this.Item(item))
                    :
                    (<Text>暂无</Text>)    
                }
            </View>
        </View>;

        return List;
    }
}
