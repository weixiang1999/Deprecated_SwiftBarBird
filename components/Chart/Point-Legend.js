import React from 'react';
import { random, range } from "lodash";
import { View,StyleSheet,Text,ScrollView} from 'react-native';
import {
    VictoryChart,
    VictoryLine,
    VictoryLegend,
    VictoryScatter
  } from "victory-native";

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
})
import Radio from '../../components/Form/Radio';
import { Size } from '../../tools/Normal';
/*
 <LineLegend
    buttons={['周','月','年']}
    data={[{x:1,y:2},]}
    content={['月总收入: 1200','最高日:5','最低日:30','平均值:20','峰值:40']}
    onOptionChanged={(option)=>{this.changeWide(option)}}
    average={[{title:'个人均值',value:random(2000,3000),color:'deepskyblue'}]}
    legend={[{name:'均值',color:'deepskyblue'}]}
/>
[
{ x: '张三', y: 2 },
{ x: '李四', y: 3 },
{ x: '王五', y: 5 },
{ x: '赵六', y: 4 },
{ x: '孙七', y: 7 }
]
*/
export default class  extends React.Component
{
    constructor(props) {
        super(props);
    }

    render()
    {
        return(
            <View>
                <View style={{flexDirection:'row',}}>
                <View style={{flex:1,justifyContent:'flex-end',paddingLeft:20,paddingTop:10}}>
                    <Text style={{fontSize:15,fontWeight:'200'}}>{this.props.content[0]}</Text>
                    <View style={{marginVertical:2}}/>

                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:9,fontWeight:'200'}}>{this.props.content[1]}</Text>
                    <View style={{marginHorizontal:2}}/>
                        <Text style={{fontSize:9,fontWeight:'200'}}>{this.props.content[2]}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:9,fontWeight:'200'}}>{this.props.content[3]}</Text>
                    <View style={{marginHorizontal:2}}/>
                        <Text style={{fontSize:9,fontWeight:'200'}}>{this.props.content[4]}</Text>
                    </View>
                </View>   
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',}}>
                        <Radio
                        buttons={this.props.buttons}
                        onOptionChange={(option)=>this.props.onOptionChanged(option)}
                        style={{height:30,width:100}}
                        />
                    </View>          
                </View>
                <VictoryChart animate={{duration: 500}} 
                padding={{ top: 20, bottom: 30,right:30,left:60 }}
                height={256}
                {...this.props.legend?{domainPadding:{y: [0,30*this.props.legend.length]}}:null}
                >
                <VictoryScatter
                    animate={{
                        duration: 1500,
                        onLoad: { duration: 1500 }
                    }}
                    style={{ data: { fill: "#c43a31" } }}
                    size={7}
                    data={this.props.data}
                    labels={this.props.labels}
                />
                {
                    this.props.average?
                    this.props.average.map(item=>
                        <VictoryLine
                        animate={{
                            duration: 1500,
                            onLoad: { duration: 1500 }
                        }}
                        style={{
                            data: { stroke: item.color||"deepskyblue" },
                            parent: { border: "1px solid #ccc"}
                        }}
                        data={[{x:0,y:item.value},{x:this.props.data.length-1,y:item.value}]}
                    />
                    )
                    :null
                }
                {
                    this.props.legend?
                    <VictoryLegend
                    title=""
                    rowGutter={-10}
                    height={40}
                    padding={{ top: 0, bottom: 0,right:0,left:0 }}
                    style={{ title: { fontSize: 15,fontWeight: '200', } }}
                    borderPadding={{ top: 0, bottom: 0 }}
                    data={
                       this.props.legend.map(item=>({ name: item.name||"均值", symbol: { fill: item.color||"deepskyblue",} })) }
                    x={Size.width*0.7}
                    />
                    :
                    null
                }
               
                
                </VictoryChart>
            </View>
            )
    }
}


