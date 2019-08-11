import React from 'react';
import {
    VictoryLegend,
    VictoryPie,
    VictoryLabel
  } from "victory-native";
import { random, range } from "lodash";
import { TouchableOpacity,View,Alert,Text} from 'react-native';
import {Size} from '../../tools/Normal';
import Circle from '../../components/Shape/Circle';
/**
 <PieLegend 
data={this.state.transitionData}
title={'今日收益： +220'}
legend={[{name:'自来客:1',color:'cyan'},{name:'未消费:2',color:'orange'},{name:'套餐:3',color:'deepskyblue'},{name:'正价:4',color:'limegreen'}
,{name:'预定:4',color:'gold'}]}
/>
 */
export default class  extends React.Component
{
    times = 0;
    constructor(props) {
        super(props);
        this.state = {
          
        };
        this.props.data= this.props.data===[]?[{x:'',y:1}]:this.props.data;
      }

    Pie()
    {
        //["tomato", "orange", "gold", "cyan", "#FF8888",'deepskyblue','limegreen' ]
        return(
            <VictoryPie
                innerRadius={50}
                labelRadius={200}
                colorScale={this.props.data?this.props.data.map(i => i.color):["tomato", "orange", "gold", "cyan", "#FF8888",'deepskyblue','limegreen' ]}
                style={{ labels: { fontSize: 0,fontWeight:'200' }}}
                data={this.props.data?this.props.data.map(i=>({x:i.x,y:i.y})):[] }
                height={Size.width*0.4}
                width={Size.width*0.4}
                padding={{ top: 0, bottom: 0,right:0,left:0 }}
                animate={{duration: 400}}
            />
            
        )
    }
    PieLegend()
    {
        console.log('第' + (this.times++));
        console.log(this.props.legend);
        return(
            <VictoryLegend 
                title={this.props.title}
                orientation="vertical"
                gutter={10}
                rowGutter={{ top: 0, bottom: 0 }}
                height={this.props.height || 230}
                padding={{ top: 0, bottom: 0,right:0,left:0 }}
                style={{ title: {fontSize: 15,fontWeight: '200', } }}
                borderPadding={{ top: 0, bottom: -10 }}
                data={
                    this.props.legend.map(item=>( { name: item.name, symbol: { fill: item.color,} }))
                }
                titleComponent={
                <VictoryLabel 
                lineHeight={1}
                style={[{ fontSize: 15, fontWeight: '200',},{ fontSize: 15, fontWeight: '200', }]}
                />}
            />
        )

    }
    Legend()
    {
        console.log('第' + (this.times++));
        console.log(this.props.legend);
        return(
            <View style={{}}>
                <View style={{marginBottom: 20}}>
                    {
                        this.props.title
                        ?
                        this.props.title.map(i => 
                        <View><Text style={{ fontSize: 15, fontWeight: '200', color: '#000'}}>{i}</Text></View>)
                        : null
                    }
                </View>
                {
                    this.props.legend
                    ?
                    this.props.legend.map(item=>(
                    <View style={{marginBottom: 13, flexDirection: 'row', alignItems: 'center'}}>
                        <Circle  style={{marginRight: 10}} size={13} color={item.color}/>
                        <Text style={{fontSize: 13,fontWeight: '200', color:'#000'}}> {item.name}</Text>
                    </View>
                    ))
                    :null
                }
            </View>    
        )

  }
    render()
    {
        return(
        
            <View style={{flexDirection:'row',flex:1}}>
                <View style={{flex:0.618,justifyContent:'center',alignItems:'center'}}>
                    {this.Pie()}
                </View>
                <View style={{marginTop:15, marginLeft: 10, flex:1-0.618,justifyContent:'center',...this.props.legendStyle}}>
                    {this.Legend()}     
                </View>     
            </View>
            
          
        )
    }
}
