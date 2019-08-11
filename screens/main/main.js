import React from 'react';
import { StyleSheet, View, Alert, ScrollView, AsyncStorage } from 'react-native';
import MenuView from '../../components/Common/MenuView';
import Card from '../../components/Common/Card';
import { Mock, Tips, Size, ClassifyByKey } from '../../tools/Normal';
import { NoticeBar, WhiteSpace, Modal, Button } from '@ant-design/react-native';
import InfoItem from '../../components/List/InfoItem';
import PieLegend from '../../components/Chart/Pie-Legend';
import LineLegend from '../../components/Chart/Line-Legend';
const moment = require('moment');
const INIT = [
    {
        name: '总数',
        number: 0,
        color: 'tomato',
    },{
        name: '待处理',
        number: 0,
        color: 'orange',
    },{
        name: '套餐',
        number: 0,
        color: 'gold',
    },{
        name: '正价',
        number: 0,
        color: 'limegreen',
    },{
        name: '预定',
        number: 0,
        color: '#FF8888',
    },{
        name: '未消费',
        number: 0,
        color: 'deepskyblue',
    },
];
export default class extends React.Component
{
    static navigationOptions = {
        title:'概览',
      };
    constructor(props)
    {
        super(props);
        console.log(this.props.setting);
        this.state = {
            announcement:[],
            todayData: [{x:1,y:1,color:'tomato'}],
            todayDataNumber: INIT,
            income: [ `套餐：+${0}元`, `正价：+${0}元` ],
            dailyReport: {

            },
            periodData: [{x:1, y:1},{x:2, y:1}],
            Info_visible: false,
            maxDay: '',
            minDay: '',
            max: 0,
            min: 0,
            total: 0,
            average: 0,
        };
   
    }
    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.getTodayData();
            setTimeout(() => this.getAnnouncement(), 200);
            setTimeout(() => this.getChartData(), 400);
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();
    }

    Modal_Report() {
        const Trans = {
            date: '日期',
            total_order_number: '总订单量',
            normal_sale_number: '正价销售量',
            normal_sale_value: '正价销售额',
            package_sale_number: '套餐销售量',
            package_sale_value: '套餐销售额',
            cancelled_number: '未消费',
            total: {
                label: '总金额',
                value: this.state.dailyReport.package_sale_value + this.state.dailyReport.normal_sale_value
            }

        };
        const Info = () => {
            return(
                <View style={{height: Size.height*0.5}}>
                    <ScrollView style={{ paddingVertical: 10,flex:1 }}>
                        {
                           Object.keys(Trans).map(key => {
                                if (typeof Trans[key] === 'string') {
                                    return  <InfoItem
                                            label={Trans[key]}
                                            value={this.state.dailyReport[key]}
                                            />
                                } else {
                                    return  <InfoItem
                                            label={Trans[key].label}
                                            value={Trans[key].value}
                                            />
                                }
                           })
                           
                        }     
                    </ScrollView>
                    <View style={{marginBottom:10}}/>
                    <Button type="warning" onPress={()=>{ Commit()}}>
                        上传日志
                    </Button>
                </View>
            );
        };
        const Commit = async () => {
            if (this.state.unProcessedNumber !== 0 ) {
                Tips('今天还有未处理的订单！');
                return;
            } else {
                let newR = JSON.parse(JSON.stringify(this.state.dailyReport));
                newR.date = moment().format('YYYY-MM-DD');
                const res = await Http.post(Service.account,{ ...newR });
                Tips(res.message);
            }
        };   
        return(
            <Modal
            title={'生成日志'}
            transparent
            onClose={()=>
                this.setState({
                    Info_visible: false
                })}
            maskClosable
            visible={this.state.Info_visible}
            closable
            >
                {Info()}
            </Modal>
        );
    }
    async getChartData(period = '7天') {
        const day = period === '7天' ? 7 : (period === '30天' ? 30 : 365);
        const DateArray = _.range(0, day).map(d => moment().subtract(d, 'days').format('YYYY-MM-DD'));
        const res = await Http.getFromAPI(Service.account, {
            filter: {
                date: DateArray,
            },
            attributes: ['normal_sale_value', 'package_sale_value', 'date'],
        });
        console.log(res.data);
        const ClassifyByDate = ClassifyByKey(res.data, 'date');
        const newArray = [];
        console.log(ClassifyByDate);
        Object.keys(ClassifyByDate).forEach(date => {
            const dateArray = ClassifyByDate[date];
            const newObject = {};
            dateArray.forEach(report => {
                Object.keys(report).forEach(key => {
                    if(!newObject[key]) {
                        newObject[key] = report[key];
                    } else {
                        if(key !== 'date' && key!== 'status') {
                            newObject[key] += report[key];
                        } 
                    }
                });
            });
            newArray.push(newObject);
        });
        console.log(newArray);

        const sorted = newArray.sort((a, b) => {
            if(moment(a.date).isAfter(b.date)) {
                return 1;
            } else {
                return -1;
            }
        });
        let max = 0;
        let min = 999999999999999;
        let maxDay = '';
        let minDay = '';
        let total = 0;
        if (res.status === 1 ) {
            const data = sorted.map( (i,index) => {
                let s = i.package_sale_value + i.normal_sale_value;
                s > max && (max = s, maxDay = i.date);
                s < min && (min = s, minDay = i.date);
                total += s;
                return (
                    {
                        x: period === '7天' ? i.date.split('-')[2] : index,
                        y: s,
                    }
                )
            });
            this.setState({ max, min, maxDay, minDay, total, average: Math.floor(total/(newArray.length)), periodData: data});
        }
    }

    async getTodayData()
    {
        const ClassifyRule = {
            总数:{
                name: '总数',
                number: 0,
                color: 'tomato',
            },
            待处理:{
                name: '待处理',
                number: 0,
                color: 'orange',
            },
            套餐:{
                name: '套餐',
                number: 0,
                color: 'gold',
            },
            正价:{
                name: '正价',
                number: 0,
                color: 'limegreen',
            },
            预定:{
                name: '预定',
                color: '#FF8888',
                number: 0,
            },
            未消费:{
                name: '未消费',
                color: 'deepskyblue',
                number: 0,
            },
        }
        const date = moment().format('YYYY-MM-DD');
        const res = await Http.post(Service.getTodayData,{
            filter: {
                created_time: moment().format('YYYY-MM-DD')
            },
            attributes: [ 
              'id', 'order_status', 'is_arrived',
              'order_type', 'pay_method', 'consumption',
              'customer_sex', 'require_type', 'customer_sex',
              'is_goodfeedback',
            ],
        });
        console.log(res);
        if (res.status === 1) {
            const order_data = res.data;
            let package_consumption = 0; //套餐
            let normal_consumption = 0; //正价
            let package_number = 0;
            let normal_number = 0;

            let require_type_count = {
                卡座: 0,
                包房: 0,
                吧台: 0,
                散台: 0,
            }
            let male_number = 0;
            let goodfeedback_number = 0;
            let not_arrived_number = 0;
            let total_time_ms = 0;
            order_data.forEach(order => {
                const { order_status: status, consumption, pay_method, is_goodfeedback,
                        created_time, finished_time, 
                        order_type: type, is_arrived, require_type, customer_sex ,

                    } = order;
                ClassifyRule['总数'].number+=1;
                male_number += (customer_sex === '男' ? 1 : 0);
                if (status === '已取消') {
                    ClassifyRule['未消费'].number += 1;
                } else if (status === '已完成') {
                    if (is_arrived === '否') {
                        ClassifyRule['未消费'].number += 1;
                        // not_arrived_number += 1;
                    } else {
                        if (type === '正价') {
                            ClassifyRule['正价'].number += 1;
                            normal_consumption += consumption;
                            normal_number += 1;
                        } else if (type === '套餐') {
                            ClassifyRule['套餐'].number += 1;
                            package_consumption += consumption;
                            package_number += 1;
                        }
                        require_type_count[require_type] += 1;
                        goodfeedback_number += (is_goodfeedback === '是' ? 1 : 0);
                        total_time_ms += Math.floor((new Date(finished_time).getTime() - new Date(created_time).getTime())/1000);

                    }
                   
                } else if (status === '预定中') {
                    ClassifyRule['预定'].number += 1;
                } else {
                    ClassifyRule['待处理'].number += 1;
                }
            });

            const dailyReport = {
                date,
                require_type_number_kz: require_type_count['卡座'],
                require_type_number_bf: require_type_count['包房'],
                require_type_number_st: require_type_count['散台'],
                require_type_number_bt: require_type_count['吧台'],
                male_number,
                package_sale_number: package_number,
                package_sale_value: package_consumption,
                normal_sale_number: normal_number,
                normal_sale_value: normal_consumption,
                cancelled_number: ClassifyRule['未消费'].number,
                is_goodfeedback_number: goodfeedback_number,
                total_order_number: ClassifyRule['总数'].number,
                // average_cost_time_per_order: total_time_ms/(normal_number+package_number),
            }

            this.setState({ dailyReport, unProcessedNumber: ClassifyRule['待处理'].number });
            console.log(dailyReport);

            const todayDataNumber = Object.keys(ClassifyRule).map(key => {
                const i = ClassifyRule[key];
                return {
                    name: i.name,
                    number: i.number,
                    color: i.color,
                }
            });


            this.setState({ 
                income: [ `套餐：+${package_consumption}元`, `正价：+${normal_consumption}元` ],
                todayDataNumber: todayDataNumber,
                todayData: Object.keys(ClassifyRule).map((key,index) => {
                    const i = ClassifyRule[key];
                    return { x: index, y: i.number, color: i.color }
                }),
                dailyReport,
            });
            
        }
        else if (res.status === 0) {
            this.setState({
                income: [ `套餐：+${0}元`, `正价：+${0}元` ],
                todayDataNumber: Object.keys(ClassifyRule).map(key => {
                    const i = ClassifyRule[key];
                    return {
                        name: i.name,
                        number: i.number,
                        color: i.color,
                    }
                }),
                todayData: [{x:1,y:1,color:'tomato'}]
            })
        }
    }

    async getAnnouncement() {

        const res = await Http.getFromAPI(Service.announcement,{
            filter: {
                created_time: [ 
                    moment().subtract(1,'days').format('YYYY-MM-DD'), 
                    moment().subtract(2,'days').format('YYYY-MM-DD') ,
                    moment().format('YYYY-MM-DD')
                ],

            },
            attributes: [ 
              'id', 'content', 'created_time',
            ],
        });
        this.setState({announcement:res.data});
    }

    render()
    {
        return (
            <MenuView
            menu={[
                {
                    title: '生成日报',
                    visible: false,
                    icon: 'md-clipboard',
                    color: '#D28EFF',
                    onPress: () => { this.setState({Info_visible: true}, () => {
                        console.log(this.state);
                    }); }
                },
                ]}
            >
                <ScrollView>
                    {
                        this.state.announcement.map(i=>
                        <NoticeBar mode="link">
                        {moment(i.created_time).format('MM-DD HH:mm')+':'+i.content}
                        </NoticeBar>)
                    }
                    <Card title={'今日概览'} style={{flexDirection:'row',}}>
                        <PieLegend 
                        data={this.state.todayData}
                        title={this.state.income}
                        legend={this.state.todayDataNumber.map(i => ({ name: i.name+ '：' + i.number, color: i.color }))}
                        />
                    </Card>              
                    <Card title={'近期概览'} style={{}}>
                        <LineLegend
                            average={[{title:'日均值',value: this.state.average,color:'deepskyblue'},]}
                            buttons={['7天','30天']}
                            data={this.state.periodData}
                            content={[
                                `总收入:${this.state.total}`,
                                `最高日:${this.state.maxDay}`,
                                `最低日:${this.state.minDay}`,
                                `平均值:${this.state.average}`,
                                `峰值:${this.state.max}`
                            ]}
                            onOptionChanged={(option)=>{
                                this.getChartData(option);
                            }}
                            legend={[{name:'日均值',color:'deepskyblue'},]}
                        />
                    </Card>
                </ScrollView>
                {this.Modal_Report()}
            </MenuView>
      )
      
      
    }
 
}
