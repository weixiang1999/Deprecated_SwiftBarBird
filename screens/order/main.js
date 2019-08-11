import React from 'react';
import {DeviceEventEmitter,View} from 'react-native';
import MenuView from '../../components/Common/MenuView';
var ScrollableTabView = require('react-native-scrollable-tab-view');
import OrderList from '../../components/List/OrderList';
import ButtonList from '../../components/Common/ButtonList';
const moment = require('moment');
export default class extends React.Component
{
    static navigationOptions = ({ navigation }) => {
        return {
          title:'订单',
        };
      };
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
        }
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('refreshCurrentPage' ,() => {
            DeviceEventEmitter.emit('refreshOrder', this.state.currentPage);
        });
    }
    componentWillUnmount() {
        // Remove the event listener
        // this.focusListener.remove();
    }

    render()
    {
        //预定中，待接受，待跟进，已取消，待修改
        //已跟进，已修改
        //已结束
        return(
            <MenuView
            menu={[
                {
                    title: '刷新订单',
                    visible: true,
                    icon: 'md-refresh',
                    color: '#EE7700',
                    onPress: () => DeviceEventEmitter.emit('refreshOrder',this.state.currentPage)
                },
                {
                    title: '发布订单',
                    visible: true,
                    icon: 'md-create',
                    color: '#FF8888',
                    onPress: () => this.props.navigation.navigate('addOrder')
                },
            ]}
            >
            <ScrollableTabView
                onChangeTab={
                    (item) => {
                        this.setState({currentPage:item.i+1});
                        DeviceEventEmitter.emit('refreshOrder',item.i+1);
                    }}
                >
                    <OrderList
                        tabLabel={'待处理'}
                        page={1}
                        filter= {{
                            order_status: [ '预定中', '待接受','待跟进','待修改','待联系','待接到' ],
                            // created_time: ['2019-04-13', '2019-04-12'],
                        }}
                        onPress={(id) => { this.props.navigation.navigate('orderinfo',{ id }) }}
                    />
                    <OrderList
                        tabLabel={'已跟进'}
                        page={2}
                        filter= {{
                            order_status: [ '已跟进','已修改' ],
                        }}
                        onPress={(id) => { this.props.navigation.navigate('orderinfo',{ id }) }}
                    />
                    <OrderList
                        tabLabel={'已结束'}
                        page={3}
                        filter= {{
                            order_status: [ '已完成','已取消' ],
                            created_time: [ 
                                moment().subtract(1,'days').format('YYYY-MM-DD'), 
                                moment().subtract(2,'days').format('YYYY-MM-DD') ,
                                moment().format('YYYY-MM-DD')
                            ],
                        }}
                        onPress={(id) => { this.props.navigation.navigate('orderinfo',{ id }) }}
                    />
                </ScrollableTabView>
            </MenuView>
        )
    }
    
    
}
