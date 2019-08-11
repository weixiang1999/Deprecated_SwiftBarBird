import React from 'react';
import { random, range } from "lodash";
import { View,StyleSheet,TouchableOpacity,Text,ScrollView} from 'react-native';
import { Button,Icon} from 'react-native-elements';
import ListByName from '../../components/List/ListByName';
import { Portal,Toast,Modal,Button as ButtonA,Picker} from '@ant-design/react-native';
import LineLegend from '../../components/Chart/Line-Legend';
import Card from '../../components/Common/Card';
import InfoItem from '../../components/List/InfoItem';
import ScatterLegend from '../../components/Chart/Point-Legend'


export default class  extends React.Component
{
    static navigationOptions = {
        title:'商户详情',
      };
    constructor(props) {
        super(props);
        this.state = {
            data:[{x:1,y:1},{x:2,y:2}],
            average:[{title:'门店均值',value:2000,color:'deepskyblue'},{title:'地区均值',value:3000,color:'limegreen'},]
        };
    }
    componentDidMount()
    {
        setTimeout(() => {
            this.setState({data:this.getTransitionData(31),
                average:[{value:2000,color:'deepskyblue'},{value:3000,color:'limegreen'},],
        })}, 3000);

    }
    changeWide(options)
    {
        const data=options===0?this.getTransitionData(7):this.getTransitionData(31);
        this.setState({data:data, average:[{title:'个人均值',value:2000,color:'deepskyblue'},{title:'门店均值',value:2500,color:'limegreen'},]});
    }
    getTransitionData(l) {
        const n = random(l, l);
        return range(n).map((i) => {
          return {
            x:i,
            y: random(1300, 3700)
          };
        });
      }
    render()
    {
        return(
            <ScrollView>
                <Card title={'门店月报'} style={{}}>
                    <LineLegend
                        buttons={['周','月','年']}
                        data={this.state.data}
                        content={['月总收入: 1200','最高日:5','最低日:30','平均值:20','峰值:40']}
                        onOptionChanged={(option)=>{this.changeWide(option)}}
                        average={this.state.average}
                        legend={[{name:'个人均值',color:'deepskyblue'},{name:'员工均值',color:'limegreen'}]}

                    />
                </Card>
                <Card title={'员工月报'} style={{}}>
                    <ScatterLegend
                        buttons={['周','月','年']}
                        data={[
                            { x: '张三', y: 2000 },
                            { x: '李四', y: 3000 },
                            { x: '王五', y: 2500 },
                            { x: '赵六', y: 3200 },
                            { x: '孙七', y: 2200 }
                            ]}
                        labels={[
                            { x: '张三', y: 2000 },
                            { x: '李四', y: 3000 },
                            { x: '王五', y: 2500 },
                            { x: '赵六', y: 3200 },
                            { x: '孙七', y: 2200 }
                            ].map(x=>x.x)}
                        content={['月总收入: 1200','最高日:5','最低日:30','平均值:20','峰值:40']}
                        onOptionChanged={(option)=>{this.changeWide(option)}}
                        average={this.state.average}
                        legend={[{name:'门店均值',color:'deepskyblue'},{name:'地区均值',color:'limegreen'}]}

                    />
                </Card>
            </ScrollView>

        );
    }
}

