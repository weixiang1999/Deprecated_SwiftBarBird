import React from 'react';
import {StyleSheet,View,ScrollView,FlatList,ImageBackground,TouchableOpacity,Text,AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, Modal, Button } from '@ant-design/react-native';
import MenuView from '../../components/Common/MenuView';
import { Overlay } from 'react-native-elements';
import Calendar from '../../components/Common/Calender';
import Card from '../../components/Common/Card';
var moment = require('moment');
import PieLegend from '../../components/Chart/Pie-Legend';
import { ClassifyByKey, Size } from '../../tools/Normal';
import AccountItem from '../../components/List/AccountItem';
import LineLegend from '../../components/Chart/Line-Legend';
import ListByTime from '../../components/List/ListByTime';
import Form from '../../components/Form/Form';
import LoadingPage from '../../components/Common/LoadingPage';
export default class extends React.Component
{
    static navigationOptions = {
        title:'日历',
        headerRight:(<View/>)
    };
    constructor(props)
    {
        super(props);
        this.state={
            onLoading: false,
            todayData: [{x:1,y:1,color:'tomato'}],
            todayDataNumber: [],
            income: '',
            dailyReport: {

            },


            periodData: [{x:1, y:1},{x:2, y:3}],
            maxDay: '',
            minDay: '',
            max: 0,
            min: 0,
            total: 0,
            average: 0,

            title:moment().format('MM-DD'),
            dateChoosed: [],
            barInfoArray: [],
            ChooseStore_visible: false,
            Image_visible: false,
            image_loading: true,
            uri:'',
            barData: [],
            bar_name: '',
            bar_id:'',
            user_type:'',
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('user_type', (err, user_type) => {
            this.setState({user_type});
            if(user_type !== '门店客服' && user_type !== '销售员') {
                AsyncStorage.getItem('barInfoArray',(err, barInfoArray) => {
                    this.setState({barInfoArray: JSON.parse(barInfoArray), currentBarInfoArray: []}, () => {
                    });
                });
            } else {
                this.getDayData();
                setTimeout(()=> this.getChartData(),200);
            }
        });
    }

    async GetImageInfo(photo_id) {
        const PhotoRes = await Http.get(Service.img, { id: photo_id });
        PhotoRes.status === 1 && ( this.setState({ uri: Service.host + PhotoRes.data.path, image_loading: true, Image_visible: true }) );
    }
    OrderListPerDay(date, list) {
        
        const { user_type, barInfoArray } = this.state;
        const renderItem = (item) => {
            const { is_goodfeedback, order_type, pay_method, is_arrived, bar_id } = item;
            const newItem = item;
            if(user_type === '区域经理') {
                newItem.user_type = user_type;
                newItem.bar_name = barInfoArray.filter(i => i.id === bar_id)[0].bar_name;
            }
            return (
                <AccountItem 
                item={newItem}
                onImgOpen={(id) => { this.GetImageInfo(id) }}
                onPress={(id) => { this.props.navigation.navigate('orderinfo',{ id }) }}
                tips={[
                    is_arrived === '否' ? { tip: '客人未到', color: 'red' } : null,
                    is_goodfeedback ? { 
                        tip:  is_goodfeedback === '是' ? '已好评' : '未好评', 
                        color: is_goodfeedback === '是' ? 'limegreen' : '#FF7744' 
                    } : null,
                    order_type ? { tip: order_type, color: 'deepskyblue' } : null,
                    pay_method ? { tip: pay_method.replace('购买',''), color: '#00BBFF' } :null,
                ]} 
                />
            );
        }
        console.log('传入列表');
        console.log(list);
        return <ListByTime
                date={date}
                list={list}
                renderItem={renderItem}
                />;
    }
    async getDayData(date = [moment().format('YYYY-MM-DD')])
    {
        if(date.length === 0) {
            date = [moment().format("YYYY-MM-DD")];
        }
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
        const { currentBarInfoArray, bar_id, user_type } = this.state;
        const res = await Http.getFromAPI(Service.order,{
            filter: {
              created_time: date,
              bar_id: user_type === '销售员' || user_type === '门店客服' ?
                      bar_id
                      :
                      currentBarInfoArray.length !== 0 ?currentBarInfoArray.map(i => i.id) : [],
            },
            attributes: [ 
              'id', 'order_status', 'is_arrived',
              'order_type', 'pay_method', 'consumption',
              'customer_sex', 'require_type', 'customer_sex',
              'is_goodfeedback', 'created_time',
              'order_photo_id', 'package_id',
              'bar_id',
            ],
        });
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
//————————————————————————————订单信息————————————————————————————
            const todayDataNumber = Object.keys(ClassifyRule).map(key => {
                const i = ClassifyRule[key];
                return {
                    name: i.name+':'+i.number,
                    color: i.color,
                }
            });

            const SortedById = res.data.sort((a, b) => b.id - a.id);
            const AddDate = SortedById.map( i => {
                const i0 = i;
                i0.Date = moment(i.created_time).format('YYYY-MM-DD');
                return i0;
            });
            const ClassifyByDate = ClassifyByKey(AddDate, 'Date');
            setTimeout(() => {
                console.log('状态更新');
                console.log(ClassifyByDate);
                this.setState({  
                    list: ClassifyByDate,
                    datelist: Object.keys(ClassifyByDate), 
                }); 
            },500);
//————————————————————————————订单信息————————————————————————————            



            this.setState({ 
                income: [ `套餐：+${package_consumption}元`, `正价：+${normal_consumption}元`, `总计：+${normal_consumption+package_consumption}元` ],
                todayDataNumber: todayDataNumber,
                todayData: Object.keys(ClassifyRule).map((key,index) => {
                    const i = ClassifyRule[key];
                    return { x: index, y: i.number, color: i.color }
                }),
                dailyReport,
               
                onLoading: false,
            },() => { console.log(this.state.list) });
            
        }
        else if (res.status === 0) {
            this.setState({
                income: [ `套餐：+${0}元`, `正价：+${0}元` ],
                todayDataNumber: Object.keys(ClassifyRule).map(key => {
                    const i = ClassifyRule[key];
                    return {
                        name: i.name+':'+i.number,
                        color: i.color,
                    }
                }),
                todayData: [{x:1,y:1,color:'tomato'}],
                onLoading: false,
                list: {},
                datelist: [],
            })
        }
        console.log(res);
    }

    async getChartData(dateArray = [moment().format('YYYY-MM-DD')]) {
        const { currentBarInfoArray, bar_id, user_type } = this.state;
        const res = await Http.getFromAPI(Service.account, {
            filter: {
                date: dateArray,
                bar_id: user_type === '销售员' || user_type === '门店客服' ?
                bar_id
                :
                currentBarInfoArray.length !== 0 ?currentBarInfoArray.map(i => i.id) : [],
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
        console.log(newArray);
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
                        x: sorted.length < 20 ? i.date.split('-')[2] : index,
                        y: s,
                    }
                )
            });
            console.log('更新图表');
            this.setState({ max, min, maxDay, minDay, total, average: Math.floor(total/(newArray.length)), periodData: data}, () =>{
                console.log('更新当前图表');
            });
        }
    }

    Modal_ImageInfo() {
        return(
            <Overlay
            isVisible={this.state.Image_visible}
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            overlayBackgroundColor="transparent"
            width="auto"
            height="auto"
            onBackdropPress={() => this.setState({Image_visible: false})}
            >    
            <ImageBackground
                source={{
                    uri: this.state.uri,
                }}
                onLoad={()=>{this.setState({image_loading:false})}}
                style={{width:300,height:400,borderRadius:10}}
            >
                {
                    this.state.image_loading?
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator />
                    </View>
                    :
                    null
                }
                <TouchableOpacity onPress={()=>{this.setState({Image_visible: false})}} style={{position:'absolute'}}>
                    <Icon
                    name={'md-close'}
                    size={25}
                    color={'red'}
                    style={{
                        marginLeft:10,
                        marginTop:5,
                    }}
                    />
                </TouchableOpacity>
            
            </ImageBackground>
            </Overlay>
            )
    }



      
    render()
    {
        if (this.state.onLoading === true) {
            return(
                <View style={styles.container}>
                <LoadingPage
                    iconType={'ionicon'}
                    iconName={'md-calendar'}
                    iconColor={'#FFDD55'}
                />
                </View>  
            
            
            );
        } else {
            return (
                <MenuView 
                style={{flex: 1}}
                menu={[
                    {
                        title: '选择门店',
                        visible: true, //this.state.user_type === '管理员',
                        icon: 'md-business',
                        color: 'gray',
                        onPress: () => this.setState({ChooseStore_visible: true})
                      },
                    ]}
                >
                    <ScrollView style={styles.container}>
                   
                    {
                        this.state.user_type === '区域经理' || this.state.user_type === '管理员' ?
                        <Card 
                        title='选择门店'
                        >
                        <Form
                            Form={[
                                {
                                    type:'CheckBox',
                                    style:{
                                        marginHorizontal: 25,
                                        marginTop:-10,
                                    },
                                    data: this.state.barInfoArray.map(i => {
                                        const newI = i;
                                        newI.label = newI.bar_name;
                                        return newI;
                                    }),
                                    onValueChange:async (text)=>{
                                        this.setState({currentBarInfoArray: text}, () => {
                                            this.getDayData(this.state.dateChoosed);
                                            setTimeout(() => { this.getChartData(this.state.dateChoosed) }, 300);
                                        });
                                    }
                                },
                                ]}
                            />
                        </Card>
                        :null
                    }
               
                    <Card
                    title='选择时间'>
                        <Calendar
                        title={this.state.bar_name}
                        onDateChange={(dateArray) => {
                            setTimeout(() => dateArray.length >= 1 && this.getDayData(dateArray), 200);   
                            dateArray.length > 1 && this.getChartData(dateArray); 
                            this.setState({
                                dateChoosed: dateArray, 
                                title: (
                                        dateArray.length >=4 ? 
                                        dateArray[0]+'到'+dateArray[dateArray.length-1]
                                        : 
                                        dateArray.map(d => moment(d, 'YYYY-MM-DD').format('MM-DD')).join(',')
                                    )+'等共'+dateArray.length+'天'
                                    
                            });
                            
                        }}
                        />
                    </Card>
                    <Card
                    title={this.state.title}
                    >
                        <PieLegend 
                        data={this.state.todayData}
                        title={this.state.income}
                        legend={this.state.todayDataNumber}
                        height={270}
                        />
                    </Card>
                    <Card title={'收入曲线'}>
                        <LineLegend
                            average={[{title:'日均值',value: this.state.average,color:'deepskyblue'},]}
                            data={this.state.periodData.length>=2?this.state.periodData:[{x:0, y:0},{x:0, y:0}]}
                            content={[
                                `总收入:${this.state.total}`,
                                `最高日:${this.state.maxDay}`,
                                `最低日:${this.state.minDay}`,
                                `平均值:${this.state.average}`,
                                `峰值:${this.state.max}`
                            ]}
                            legend={[{name:'日均值',color:'deepskyblue'},]}
                        />
                    </Card>
                    <Card title={'订单详情'} style={{backgroundColor: '#f5f5f5'}}>
                        <FlatList
                        data={this.state.datelist}
                        renderItem={({item}) => this.OrderListPerDay(item, this.state.list[item])}
                        />
                    </Card>
                    </ScrollView>
                    {this.Modal_ImageInfo()}
                </MenuView>
                
                )
        }
    }

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
    }
})