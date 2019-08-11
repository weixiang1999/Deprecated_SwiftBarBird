import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl,DeviceEventEmitter,AsyncStorage } from 'react-native';
import ListByTime from '../../components/List/ListByTime';
import { ClassifyByKey } from '../../tools/Normal';
var moment = require('moment');
var _ =require('lodash');
import LoadingPage from '../../components/Common/LoadingPage';
import Http from '../../tools/Http';
import Service from '../../tools/Service';
import OrderItem from '../../components/List/OrderItem';
import { withNavigation } from "react-navigation";
class List extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            onLoading: true,
            onRefreshing: false,
            list: {},
            user_type: '',
        }
        this.subscription = DeviceEventEmitter.addListener('refreshOrder' ,(page) => {
            if(page === this.props.page) {
                this.getOrderData(true);
            }
        });
    }
    componentWillUnmount() {
    }
    componentDidMount() {
       this.getOrderData();
       AsyncStorage.getItem('user_type', (err, user_type) => {
        this.setState({user_type});
        if(user_type !== '门店客服' && user_type !== '销售员') {
            AsyncStorage.getItem('barInfoArray',(err, barInfoArray) => {
                this.setState({barInfoArray: JSON.parse(barInfoArray)});
            });
        };

    });
    }
    async getOrderData(onLoading) {
        onLoading && this.setState({onLoading: true});
        const res = await Http.get(Service.order, { 
            ...this.props.filter, 
            attributes:[ 
                'id', 'customer_name', 'customer_phone' ,'order_status', 'created_time', 
                'followed_time', 'accepted_time', 'finished_time', 'cancelled_time',
                'is_goodfeedback','order_type', 'pay_method', 'is_arrived', 'bar_id',
                'is_self_come', 'reserve_time', 'is_reserve', 'arrived_time', 'contacted_time',
            ],
        });
        if (res.status === 0) {
            setTimeout(() => {
                this.setState({ onLoading: false, list: {}, onRefreshing: false});
            }, 1500);
           
        } else {
            const SortedById = res.data.sort((a, b) => b.id - a.id);
            const AddDate = SortedById.map( i => {
                const i0 = i;
                i0.Date = moment(i.created_time).format('YYYY-MM-DD');
                return i0;
            });
            const ClassifyByDate = ClassifyByKey(AddDate, 'Date');
            
            this.setState({ 
                list: ClassifyByDate,
                datelist: Object.keys(ClassifyByDate),
             });
            setTimeout(() => this.setState({onLoading: false, onRefreshing: false,}), 700 )
        }
        //根据时间分类
    }

    OrderListPerDay(date, list) {
        const { user_type, barInfoArray } = this.state;
        const renderItem = (item) => {
            console.log(item);
            const { is_goodfeedback, order_type, pay_method, is_arrived, bar_id, is_self_come, reserve_time, order_status } = item;
            const newItem = item;
            if(user_type === '区域经理') {
                newItem.user_type = user_type;
                newItem.bar_name = barInfoArray.filter(i => i.id === bar_id)[0].bar_name;
            }
            return <OrderItem 
                    item={newItem} 
                    tips={[
                        is_arrived === '否' ? { tip: '客人未到', color: 'red' } : null,
                        is_goodfeedback ? { 
                            tip:  is_goodfeedback === '是' ? '已好评' : '未好评', 
                            color: is_goodfeedback === '是' ? 'limegreen' : '#FF7744' 
                        } : null,
                        order_type ? { tip: order_type, color: 'deepskyblue' } : null,
                        is_self_come === '是' ? { tip: '自来客', color: 'orange' } : null,
                        pay_method ? { tip: pay_method.replace('购买',''), color: '#00BBFF' } :null,
                        order_status === '预定中' ? { tip: moment(reserve_time).format('MM-DD HH:mm'), color: '#FF44AA' }:null
                    ]} 
                    onPress={() => { this.props.onPress(item.id) }}
                    />
        }
        return <ListByTime
                date={date}
                list={list}
                renderItem={renderItem}
                />;
    }
    render()
    {
        const isEmptyObject = Object.keys(this.state.list).length === 0;
        if(isEmptyObject || this.state.onLoading) {
            return (
                <View style={styles.container}>
                    <LoadingPage
                    iconType={'material-community'}
                    iconName={'file-document-box-multiple-outline'}
                    noDataTitle={'本页没有订单'}
                    noDataSubtitle={'点击刷新'}
                    noData={this.state.onLoading ? false : isEmptyObject}
                    onPress={() => {
                        this.getOrderData(true); 
                    }}
                    />
                </View>)
        } else {
            return (
                <View style={styles.container}>
                    <FlatList
                    refreshControl={
                    <RefreshControl
                    refreshing={this.state.onRefreshing}
                    onRefresh={() => {
                        this.setState({onRefreshing: true});
                        [1,2,3].filter(i => i !== this.props.page).forEach(i => {
                            DeviceEventEmitter.emit('refreshOrder',i);
                        })
                        this.getOrderData();
                        }}
                    title='下拉刷新'
                    progressBackgroundColor='#666666'
                    tintColor='gray'
                    />
                    }
                    data={this.state.datelist}
                    renderItem={({item}) => this.OrderListPerDay(item, this.state.list[item])}
                    />
                </View>
            )
        }
    }
}
 

export default withNavigation(List);
const styles = StyleSheet.create({

    container:
    {
        flex:1,
        backgroundColor:'#F5F5F5'
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      },
  });