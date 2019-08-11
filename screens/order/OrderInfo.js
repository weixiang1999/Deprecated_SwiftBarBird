import React from 'react';
import { View, StyleSheet,AsyncStorage,Text,ScrollView,ImageBackground,TouchableOpacity,DeviceEventEmitter } from 'react-native';
import { Overlay,} from 'react-native-elements';
import { Portal,Toast,Modal,WhiteSpace,Button,ActivityIndicator } from '@ant-design/react-native';
import Card from '../../components/Common/Card';
import InfoItem from '../../components/List/InfoItem';
import Icon from 'react-native-vector-icons/Ionicons';
import IconA from 'react-native-vector-icons/AntDesign';
import StepIndicator from 'react-native-step-indicator';
import Form from '../../components/Form/Form';
import ImgPicker from '../../components/Form/ImgPicker';
import LoadingPage from '../../components/Common/LoadingPage';
import { Tips, Size, Confirm, SecondToDate,linking } from '../../tools/Normal';
import Communications from 'react-native-communications';
import MenuView from '../../components/Common/MenuView';
const moment = require('moment');
/**
  <InfoItem label={'姓名'} value={'魏祥'} labelStyle={{color:'orange'}} valueStyle={{color:'red'}}/>
 */
const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize:35,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 16,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
  }
const Trans = {
    id:'订单号',
    number:'人数',
    require_type:'需求类型',
    customer_name:'客户名',
    customer_sex:'性别',
    customer_phone:'手机号',
    order_type:'订单类型',
    order_status:'订单状态',
    pay_method:'支付方式',
    tips:'备注',
    is_phoned:'已拨打电话',
    is_arrived:'已接到',
    is_goodfeedback:'是否好评',
    package_id:'套餐号',
    package_name:'套餐名',
    package_price:'套餐价格',
    consumption:'实际消费额',
    bar_id:'酒吧ID',
    creater_id:'创建者ID',
    saleperson_id:'销售员ID',
    created_time:'日期',
    accepted_time:'接单时间',
    followed_time:'跟进时间',
    finished_time:'结束时间',
    customer_comment:'用户评论',
    order_photo_id:'消费凭证',
    username: '接单人',
    phone: '手机号',
    comment_tips: '修改原因',
    total_time:'用时',
};



export default class extends React.Component
{
    static navigationOptions = ({ navigation }) => {
        return {
          title:'详情',
          headerLeft: (
            <TouchableOpacity style={{paddingLeft:15}} onPress={()=>{
                    navigation.goBack();
                    DeviceEventEmitter.emit('refreshCurrentPage');
                }}>
                <IconA name={'arrowleft'} color={'#000'} size={25}/>
            </TouchableOpacity>
          ),
          headerRight: (
            <TouchableOpacity style={{paddingRight:15}} onPress={()=>{
                    DeviceEventEmitter.emit('refreshOrder');
                }}>
                <IconA name={'reload1'} color={'#000'} size={25}/>
            </TouchableOpacity>
          ),
        };
      };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        // const id = navigation.getParam('id');
        //this.state.id = Number([0]);
        this.state = {
            id: navigation.getParam('id'),
            currentPosition: 1,
            onLoading: true,
            noData: false,
            orderInfo: {},
            user_type: '',
            Follow_visible: false,
            Image_visible: false,
            Reject_visible: false,
            Finish_visible: false,
            Arrived_visible: false,
            Cancel_visible: false,
            labels: ["创建","接单","联系","到店","跟进","完成"],
            Img: undefined,
            package_list: [],
            is_arrived: false,
            package_id: undefined,
            consumption: undefined,
            is_goodfeedback: false,
            image_loading: true,
            pay_method: undefined,
        };
        
    }
    componentDidMount() {
        this.getOrderData();
        setTimeout(() => { this.getPackageInfo(); }, 1000);
        this.refreshListener = DeviceEventEmitter.addListener('refreshOrder', () => this.getOrderData());
    }   
    getStep(data) {
        console.log(this.state.orderInfo);
        let { order_status: status, created_time, accepted_time, followed_time, cancelled_time, finished_time, contacted_time,
            arrived_time, is_arrived } = data;
        created_time = created_time ? '\n' + moment(created_time).format("HH:mm"):'';
        accepted_time = accepted_time ? '\n' + moment(accepted_time).format("HH:mm"):'';
        followed_time = followed_time ? '\n' + moment(followed_time).format("HH:mm"):'';
        cancelled_time = cancelled_time ? '\n' + moment(cancelled_time).format("HH:mm"):'';
        finished_time = finished_time ? '\n' + moment(finished_time).format("HH:mm"):'';
        contacted_time = contacted_time ? '\n' + moment(contacted_time).format("HH:mm"):'';
        arrived_time = arrived_time ? '\n' + moment(arrived_time).format("HH:mm"):'';
        switch(status) {
            case '已取消':
            {
                const labels = ["已创建"+created_time, "接单", "联系", "到店" ,"跟进", "已取消"+cancelled_time];
                const currentPosition = labels.length;
                const style = this.state.customStyles;
                this.setState({
                    labels, 
                    currentPosition, 
                    customStyles: style,
                },()=>{console.log(this.state.customStyles)});
                break;
            }
            case '已跟进':
            {
                const labels = ["已创建"+created_time,"已接单"+accepted_time, "已联系"+contacted_time,is_arrived === '是' ? ("已到店"+arrived_time): '到店' ,"已跟进"+followed_time, "完成"];
                const currentPosition = 5;
                this.setState({labels, currentPosition,});
                break;
            }
            case '已完成':
            {
                const labels = ["已创建"+created_time,"已接单"+accepted_time, "已联系"+contacted_time,"已到店"+arrived_time ,"已跟进"+followed_time,"已完成"+finished_time];
                const currentPosition = labels.length;
                this.setState({labels, currentPosition,});
                break;
            }
            case '待联系':
            {
                const labels = ["已创建"+created_time,"已接单"+accepted_time, "联系", "到店" ,"跟进","完成"];
                const currentPosition = 2;
                this.setState({labels, currentPosition,});
                break;
            }
            case '待跟进':
            case '待修改':
            {
                const labels = ["已创建"+created_time,"已接单"+accepted_time, "已联系"+contacted_time,"已到店"+arrived_time ,status === '待跟进' ? "跟进": '修改' ,"完成"];
                const currentPosition = 4;
                this.setState({labels, currentPosition,});
                break;
            }
            case '待接受':
            {
                const labels = ["已创建"+created_time,"接单","联系","到店","跟进","完成"];
                const currentPosition = 1;
                this.setState({labels, currentPosition,});
                break;
            }
            case '待接到':
            {
                const labels = ["已创建"+created_time,"已接单"+accepted_time, "已联系"+contacted_time,"到店" ,"跟进" ,"完成"];
                const currentPosition = 3;
                this.setState({labels, currentPosition,});
                break;
            }
            case '预定中':
            {
                const labels = ["已创建"+created_time,"预定中","联系","到店","跟进","完成"];
                const currentPosition = 1;
                this.setState({labels, currentPosition,});
                break;
            }

        }
    }
    async getOrderData() {
        this.setState({onLoading: true, user_type: await AsyncStorage.getItem('user_type')});
        let Data = {};
        let OrderRes = {};
        let SalePersonRes = {};
        let PackageRes = {};
        let PhotoRes = {};
        OrderRes = await Http.get(Service.order, { id: this.state.id, });
        // OrderRes = await Mock({ status: 0 }, 2000);
        console.log(OrderRes);
        if (OrderRes.status === 1) {
            Data = { ...OrderRes.data[0] };
            Data.package_id && ( PackageRes = await Http.get(Service.package, { id: Data.package_id, attributes: [ 'id', 'package_name', 'package_price' ] }) );
            PackageRes.status === 1 && ( PackageRes.data[0].package_id = PackageRes.data[0].id, delete PackageRes.data[0].id );
            PackageRes.status === 1 && ( Data = { ...Data, ...PackageRes.data[0] } );
            
            Data.saleperson_id && ( SalePersonRes = await Http.get(Service.user, { id: Data.saleperson_id, attributes: [ 'username', 'phone' ] }) );   
            SalePersonRes.status === 1 && ( Data = { ...Data, ...SalePersonRes.data[0] } );

            Data.order_photo_id && ( PhotoRes = await Http.get(Service.img, { id: Data.order_photo_id }) );
            PhotoRes.status === 1 && ( this.setState({ uri: Service.host + PhotoRes.data.path },()=>  console.log(this.state.uri)) );
            this.setState({orderInfo: Data, onLoading: false, noData: false}, ()=>{this.getStep(Data);});
        } else {
            this.setState({noData: true, onLoading: false});
        }
      
        //根据时间分类
    }
    async getPackageInfo() {
        const res = await Http.get(Service.package);
        if (res.status === 1) {
            console.log(res);
            const list = res.data.map(i => i.package_name+'：'+i.package_price+'元');
            this.setState({
                package_list: list,
                package_value_list: res.data,
            })
        } else {
            // Tips('本门店暂无套餐，请联系客服人员添加。', () => this.props.navigation.goBack());
        }
    }
    Modal_FinishOrder() {

        const Form2 = [   
        ];
        const InfoForm = () => {
            return(
                <View style={{height: Size.height*0.15 }}>
                    <ScrollView style={{ paddingVertical: 10,flex:1 }}>
                    {
                        <Form Form={Form2} State={this.state} /> 
                    }     
                    </ScrollView>
                    <Button type="warning" onPress={()=>{Commit()}}>
                        结束订单
                    </Button>
                </View>
            );
        };
        const Commit = async () => {
            const key = Toast.loading('请稍后',0);
            const res = await Http.put(Service.order, {
                attributes: { order_status: '已完成', finished_time: new Date().toString(), },
                filter: {
                    id: this.state.id
                }
            });
            Portal.remove(key); 
            Tips(res.message, () => {
                this.setState({ Finish_visible: false });
                this.getOrderData();
            });
        };   
        return(
            <Modal
            title="结束订单"
            transparent
            onClose={()=>
                this.setState({
                    Finish_visible:false,
                })}
            maskClosable
            visible={this.state.Finish_visible}
            closable
            >
                {InfoForm()}   
            </Modal>
        );
    }
    Modal_FollowOrder() {
        const { order_type, order_status, is_self_come } = this.state.orderInfo;
        const Form2 = [
            {
                type:'DoubleCheck',
                title:'是否好评',
                onValueChange:(choose)=>{
                    this.setState({is_goodfeedback:choose});
                }
            },
            {
                type:'Radio',
                title:'订单类型',
                content:['正价','套餐'],
                visible: is_self_come === '是' ,
                style:{
                    width:220,
                },
                onValueChange:(text)=>{
                    this.setState({order_type:text, consumption: undefined});
                }
            },
            {
                type:'MuiltPicker',
                //type: 'DropDown',
                title:'选择套餐',
                data: this.state.package_list,
                // asyncData: 'package_list',
                visible: ((is_self_come === '是' && this.state.order_type === '套餐') || (order_type === '套餐' && order_status !== '待修改') ),
                onValueChange:(text)=>{
                    console.log(text);
                    // console.log(this.state.package_value_list.filter(i => i.package_name===(text.split('：')[0])));
                    const pkg = this.state.package_value_list.filter(i => i.package_name===(text[0].split('：')[0]))[0];
                    this.setState({
                        package_id: pkg.id,
                        consumption: pkg.package_price,
                    });
                }
            },
            {
                type: 'Input',
                title: `实际消费金额${order_type === '套餐' ? '(默认为套餐价格)' : '' }`,
                onValueChange:(text)=>{this.setState({consumption:text})}
            },
            {
                type:'Radio',
                title:'支付方式',
                content:['线上购买','线下购买'],
                style:{
                    width:220,
                },
                // visible: (is_self_come === '是' ) || order_type === '套餐',
                onValueChange:(text)=>{
                    this.setState({pay_method:text});
                }
            },
            {
                type: 'Input',
                title: '跟进备注(可选)',
                onValueChange:(text)=>{this.setState({customer_comment:text})}
            },
        ];
        const InfoForm = () => {
            return(
                <View style={{height: Size.height*0.63}}>
                    <ScrollView style={{ paddingVertical: 10,flex:1 }}>
                        {
                            <View style={{}}>
                                <Form Form={Form2} State={this.state} />
                                <ImgPicker
                                onImgChange={(img)=>{this.setState({Img: img})}}
                                fontSize={15}
                                ImageOptions={{
                                    width:600,
                                    height:800,
                                }}
                                style={{
                                    flex:1,
                                    margin: 12,
                                    height:35,
                                }}
                                title='上传消费凭证'
                                titleForChoosed='已选择消费凭证'
                                />
                            </View>                
                        }     
                        <View style={{marginBottom:10}}/>
                        <Button type="warning" onPress={()=>{Confirm(() => { Commit() })}}>
                            跟进订单
                        </Button>
                        <View style={{marginBottom:10}}/>
                    </ScrollView>
                   
                </View>
            );
        };

        const Commit = async () => {
            if (order_type === '套餐' && !this.state.package_id) {
                Tips('你还没有选择套餐！');
                return;
            }
            if (this.state.order_type === '套餐' && !this.state.package_id) {
                Tips('你还没有选择套餐！');
                return;
            }
            if (is_self_come === '是' && !this.state.order_type) {
                Tips('你还没有选择消费类型！');
                return;
            }
            if (!this.state.pay_method) {
                Tips('你还没有选择支付方式！');
                return;
            }
            
            if (!/^[0-9]+.?[0-9]*$/.test(this.state.consumption))  {
                Tips('输入的价格不是数字');
                return;
            }
            /*
            if (!this.state.Img) {
                Tips('你还没有选择消费凭证！');
                return;
            }*/
            const key = Toast.loading('请稍后',0);
            const { Img, package_id, is_goodfeedback, consumption, customer_comment = '无', pay_method, order_type} = this.state;
            const res = Img ? 
                        await Http.imageUpload(Service.img, Img, { filename: this.state.id + moment().format("YYYYMMDDhhmmss"), key1: '备注', value1: '消费凭证'})
                        :
                        {
                            status: 1,
                            data: {
                                id: 0,
                            }
                        };
            Portal.remove(key);
            if (res.status === 1) {
                const body = {
                    is_goodfeedback: is_goodfeedback?'是':'否',
                    order_status: '已跟进',
                    consumption,
                    order_photo_id: res.data.id,
                    pay_method,
                    order_type,
                    package_id,
                    followed_time: new Date().toString(),
                    customer_comment,
                };
                const res1 = await Http.put(Service.order, { attributes: body, filter: { id: this.state.id } });
                Tips(res1.status===1?'跟进成功':'出现错误', () => { 
                    this.setState({
                        Follow_visible: false,
                        Img: undefined,
                        consumption: undefined,
                        pay_method: undefined,
                        order_type: undefined,
                        package_id: undefined,
                    }, () => this.getOrderData());
                });
            } else {
                Tips(res.message);
            }
        };   
        return(
            <Modal
            title="完善订单信息"
            transparent
            onClose={()=>
                this.setState({
                    Follow_visible:false,
                    package_id:undefined,
                    order_type: undefined,
                })}
            maskClosable
            visible={this.state.Follow_visible}
            closable
            >
                {InfoForm()}   
            </Modal>
        );
    }

    Modal_FollowCustomer() {
        const Form1 = [
            {
                type:'DoubleCheck',
                title:'已接到客户',
                onValueChange:(choose)=>{
                    this.setState({is_arrived:choose});
                }
            },
            {
                type:'Input',
                visible: this.state.is_arrived === false,
                title:'输入未到原因',
                onValueChange:(choose)=>{
                    this.setState({comment_tips:choose});
                }
            },
        ];
        const Form2 = [
            {
                type:'Radio',
                title:'订单类型',
                content:['正价','套餐'],
                style:{
                    width:220,
                },
                onValueChange:(text)=>{
                    this.setState({order_type:text});
                }
            },
        ];
        const InfoForm = () => {
            return(
                <View style={{height: Size.height*0.45}}>
                    <ScrollView style={{ paddingVertical: 10,flex:1 }}>
                        {
                            this.state.is_arrived?             
                            (
                            <View style={{}}>
                                <Form Form={Form2} State={this.state} />
                            </View>
                            
                            ):<Form Form={Form1} State={this.state} />
                            
                        }     
                    </ScrollView>
                    <View style={{marginBottom:10}}/>
                    <Button type="warning" onPress={()=>{Commit()}}>
                        跟进订单
                    </Button>
                    <View style={{marginBottom:10}}/>
                </View>
            );
        };
      
        const Commit = async () => {
            const { order_type, is_arrived, comment_tips, Img } = this.state;
            if (this.state.is_arrived) {
                if (!order_type) {
                    Tips('你还没有选择消费类型！');
                    return;
                }
                const key = Toast.loading('请稍后',0);
                const body = {
                    order_type,
                    is_arrived: is_arrived?'是':'否',
                    order_status: '待跟进',
                    arrived_time: new Date().toString(),
                };
                const res1 = await Http.put(Service.order, { attributes: body, filter: { id: this.state.id } });
                Portal.remove(key);
                Tips(res1.status===1?'跟进到店成功':'出现错误', () => { this.setState({Arrived_visible: false}, () => this.getOrderData()) });
            } else {  
                if(!this.state.comment_tips) {
                    Tips('请输入未到原因');
                    return;
                }       
                const key = Toast.loading('请稍后',0);
                const res = await Http.put(Service.order, {
                    attributes: {
                        is_arrived: '否',
                        comment_tips, 
                        order_status: '已跟进',
                        followed_time: new Date().toString(),
                    },
                    filter: {
                        id: this.state.id,
                    }
                    
                });
                
                Portal.remove(key);
                Tips(res.status === 1 ? '跟进到店信息成功' : '出现错误', () => { this.setState({Arrived_visible: false}, () => this.getOrderData()) });
            }
        };   
        return(
            <Modal
            title="完善到店信息"
            transparent
            onClose={()=>
                this.setState({
                    is_arrived:false,
                    Arrived_visible:false,
                    order_type: undefined,
                    comment_tips: '',
                })}
            maskClosable
            visible={this.state.Arrived_visible}
            closable
            >
                {InfoForm()}   
            </Modal>
        );
    }
    ActionButtonList() {
        const { user_type } = this.state;
        const { order_status: status } = this.state.orderInfo;
        const ButtonConfig = [
            {
                title: '取消订单',
                visible: user_type === '门店客服' && status !== '已取消' && status !== '已完成' && status !== '已跟进'
                        || user_type === '销售员' && status !== '待接受' && status !== '已取消' && status !== '已跟进' && status !== '已完成' && status !== '待联系',
                        // || user_type === '区域经理' && status !== '待接受' && status !== '已取消' && status !== '已跟进' && status !== '已完成' && status !== '待联系',
                icon:'md-close',
                color: 'gray',
                onPress: () => {
                   this.setState({Cancel_visible: true});
                },
            },
            {
                title: '额外订单',
                visible: (user_type === '门店客服' || user_type === '销售员') 
                         && (status ==='已完成' || status === '已取消'),
                icon:'md-add',
                color: '#3498db',
                onPress: () => {
                   Confirm(async () => {
                    const { customer_phone, number, customer_sex, require_type, customer_name } = this.state.orderInfo;
                    const current_time = new Date().toString();
                    const reqBody = {
                        customer_name,
                        customer_phone,
                        number,
                        customer_sex,
                        require_type,
                        tips: '额外补充订单',
                        // status: '待跟进',
                        // created_time: current_time,
                        // accepted_time: current_time,

                    }
                    // console.log(reqBody);
                    const res = await Http.post(Service.order, reqBody);
                    if(res.status === 1) {
                        Tips('创建成功，即将跳转入新订单页面', () => {
                            this.setState({ id: res.data.id }, () => {
                                DeviceEventEmitter.emit('refreshOrder');
                            });
                        });
                    } else {
                        Tips('创建订单失败');
                    }
                    // console.log(res);
                   }, '确认是否添加该客户的新订单?');
                },
            },
            {
                title:'拨打电话',
                icon:'md-call',
                visible: user_type === '门店客服' || user_type === '区域经理' || user_type === '销售员' && status !=='待接受',
                color: '#00DD00',
                onPress:()=>{linking('tel:'+this.state.orderInfo.customer_phone)}
            },
            {
                title: '发送短信',
                icon: 'md-text',
                visible: user_type === '门店客服' || user_type === '区域经理' || user_type === '销售员' && status !=='待接受',
                color: '#00BBFF',
                onPress:()=>{Communications.text(this.state.orderInfo.customer_phone)}
            },
            {
                title: '接受订单',
                icon: 'md-return-right',
                visible: user_type === '销售员' && status ==='待接受',
                color: '#00DDAA',
                onPress: async () => { 
                    const res = await Http.put(Service.order, { 
                        filter: { id: this.state.orderInfo.id },
                        attributes: { order_status: '待联系', accepted_time: new Date().toString() },
                     });
                    Tips(res.status === 0 ? res.message : '接受成功,请及时跟进订单信息', () => this.getOrderData());
                },
            },
            {
                title: '跟进订单信息',
                icon:'md-create',
                visible: user_type === '销售员' && (status ==='待跟进' || status ==='待修改'),
                color: '#3498db',
                onPress:()=>{
                    this.setState({ Follow_visible: true,});
                }
            },
            {
                title: '打回订单信息',
                icon:'md-undo',
                visible: user_type === '门店客服' && status === '已跟进',
                color: '#FF7744',
                onPress:()=>{ 
                    this.setState({ Reject_visible: true });
                }
            },
            {
                title: '已联系客户',
                visible: // user_type === '门店客服' && status !== '已取消' && status !== '已完成' && status !== '已跟进'
                        user_type === '销售员' && status === '待联系',
                        // || user_type === '区域经理' && status !== '待接受' && status !== '已取消' && status !== '已跟进' && status !== '已完成' && status !== '待联系',
                icon:'md-checkbox-outline',
                color: '#BBFF00',
                onPress: () => {
                    Confirm(async () => {
                        const res = await Http.put(Service.order, { 
                            filter: { id: this.state.orderInfo.id },
                            attributes: { order_status: '待接到', contacted_time: new Date().toString() },
                         });
                        Tips(res.status === 0 ? res.message : '已确认联系客户', () => this.getOrderData());
                    });
                },
            },
            {
                title: '跟进到店信息',
                visible: // user_type === '门店客服' && status !== '已取消' && status !== '已完成' && status !== '已跟进'
                        user_type === '销售员' && status === '待接到',
                        // || user_type === '区域经理' && status !== '待接受' && status !== '已取消' && status !== '已跟进' && status !== '已完成' && status !== '待联系',
                icon:'md-man',
                color: '#FFBB00',
                onPress: () => {
                    this.setState({ Arrived_visible: true });
                },
            },
            {
                title: '结束订单',
                icon:'md-checkmark',
                visible: user_type === '门店客服' && status === '已跟进',
                color: '#1abc9c',
                onPress:()=>{
                    this.setState({ Finish_visible: true });
                }
            },
        ];
        
        return(
            ButtonConfig
        );
    }
    renderInfo() {
        const { user_type } = this.state;
        const { created_time, finished_time, order_status: status, is_arrived, is_goodfeedback, order_type, is_self_come, customer_comment, order_photo_id, reserve_time  } = this.state.orderInfo;
        console.log('消费凭证');
        console.log(order_photo_id);
        let Info1 = [];
        let Info2 = [];
        if (is_arrived === '是') {
            Info1 = [
                { key:'created_time', valueColor: 'gray', trans: (value) => moment(value).format('MM-DD') },
                (is_self_come && is_self_come === '是') && { key:'is_self_come', label: '自来客', valueColor: 'gray', },
                { key:'customer_comment', label: '跟进备注', valueColor: 'gray', },
                { key:'is_arrived', valueColor: is_arrived==='否' ? 'red' : 'limegreen', }, 
                { key:'order_type', valueColor: '#00BBFF' }, 
                ,order_type === '套餐' && 'package_name' ,
                , order_type === '套餐' && { key:'package_price', valueColor:'gray', trans: (value) => value+'元' },
                { key:'consumption', valueColor: '#00BBFF', trans: (value) => value+'元' }, 
                ,order_type === '套餐' && 'pay_method' ,
                { key: 'order_photo_id', onPress:() => { this.setState({Image_visible: true}) }, value: order_photo_id == 0 ? '无消费凭证' : '点击查看' , valueColor: order_photo_id === 0 ? 'gray' :'orange' },
                { key:'is_goodfeedback', valueColor: is_goodfeedback==='否' ? 'red' : 'limegreen', }, 
                ,'customer_name', 'customer_phone',
                user_type === '门店客服' && (status === '已跟进' || status === '待跟进' || status === '待修改' || status === '待联系') ? 'username' : undefined,
            ];
            Info2 =  [
                { key:'created_time', valueColor: '#00BBFF', trans: (value) => moment(value).format('MM-DD') },
                { 
                    key:'total_time', 
                    value: (function() {
                        const gap = Math.floor((new Date(finished_time).getTime() - new Date(created_time).getTime())/1000);
                        return SecondToDate(gap);
                    })()  
                },
                { key:'consumption', valueColor: '#00BBFF', trans: (value) => value+'元' },
                ,order_type === '套餐' && 'pay_method' ,
                { key: 'order_photo_id', onPress:() => { this.setState({Image_visible: true}) }, value: order_photo_id == 0 ? '无消费凭证' : '点击查看' , valueColor: order_photo_id === 0 ? 'gray' :'orange' },
                { key:'is_goodfeedback', valueColor: is_goodfeedback==='否' ? 'red' : 'limegreen', }, 
                'order_type','pay_method'
                ,'customer_name', 'customer_phone',
                user_type === '门店客服' && (status === '已跟进' || status === '待跟进' || status === '已完成' || status === '待联系') ? 'username' : undefined,
            ];
        } else {
            Info1 = [
                { key: 'created_time', valueColor: '#00BBFF', trans: (value) => moment(value).format('MM-DD') },
                { key: 'is_arrived', valueColor: 'red', }, 
                { key: 'comment_tips',  label: '未到原因', valueColor: 'red', }
                ,'customer_name', 'customer_phone',
                user_type === '门店客服' && (status === '已跟进' || status === '待跟进' || status === '待修改'|| status === '待联系') ? 'username' : undefined,
            ];
            Info2 =  [
                { key:'created_time', valueColor: '#00BBFF', trans: (value) => moment(value).format('MM-DD') },
                { key: 'is_arrived', valueColor: 'red', }, 
                { key: 'comment_tips',  label: '未到原因', valueColor: 'red', },
                { 
                    key:'total_time', 
                    value: (function() {
                        const gap = Math.floor((new Date(finished_time).getTime() - new Date(created_time).getTime())/1000);
                        return SecondToDate(gap);
                    })()  
                },
                ,'customer_name', 'customer_phone',
            ];
        }
        const InfoConfig = {
            顾客信息: {
                children: [
                    status === '预定中' ? { label: '创建时间', value: moment(created_time).format('MM-DD HH:mm') } : undefined,
                    status === '预定中' ? { label: '预定日期', value: moment(reserve_time).format('MM-DD HH:mm') } : undefined,
                    status === '待修改' ? { key:'comment_tips', valueColor: 'red',} : undefined,
                    (status === '待跟进' && is_self_come === '否') ? { key:'order_type', valueColor: 'orange'} : undefined,
                    ,'customer_name', 'customer_sex', 'customer_phone', 'number', 'require_type','tips'
                ],
                visible: (status, user_type) => status === '待接受' || status ==='待跟进' || status === '待修改' || status === '待联系' || status === '待接到' || status === '预定中'
            },
            订单信息: {        
                children: Info1,
                visible: (status, user_type) => status === '已跟进',
            },
            订单总结: {        
                children: Info2,
                visible: (status, user_type) => status === '已完成',
            },
            取消信息: {
                children:[
                    { key: 'comment_tips',  label: '取消原因', valueColor: 'red', }
                ],
                visible: (status, user_type) => status === '已取消',
            }
        };
        const renderList = (list) => {
            const { orderInfo } = this.state;
            return list.map(item => {
                switch(typeof(item)) {
                    case 'string':
                    {
                        return <InfoItem label={Trans[item]} value={orderInfo[item]}/>
                    }
                    case 'object':
                    {
                        return <InfoItem 
                                label={item.label || Trans[item.key]} 
                                value={item.value || orderInfo[item.key]} 
                                valueStyle={{color:item.valueColor}} 
                                onPress={item.onPress}
                                trans={item.trans}
                                />
                    }
                }
            })
        }
        return(
            <View>
            {
                Object.keys(InfoConfig).map(title => {
                    return InfoConfig[title].visible(this.state.orderInfo.order_status, this.state.user_type)?
                    <Card title={title}>
                        <ScrollView style={{height: 0.45*Size.height}}>
                        {
                            renderList(InfoConfig[title].children)
                        }
                        </ScrollView>
                       
                    </Card>
                    :
                    null
                })
            }
            </View>

        );
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
                    //method: 'GET',
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
    StatusBar() {
        return(
            <View>        
                <StepIndicator
                    customStyles={customStyles}
                    currentPosition={this.state.currentPosition}
                    labels={this.state.labels}
                    stepCount={6}
                />
            </View>
        )
    }
    Modal_RejectOrder() {
        const Form0 = [
            {
                type: 'Input',
                title: '打回原因',
                onValueChange:(text)=>{this.setState({comment_tips:text})}
            },
        ];
        const InfoForm = () => {
            return(
                <View style={{height: Size.height*0.3}}>
                    <ScrollView style={{ paddingVertical: 10,flex:1 }}>
                        {
                           <Form Form={Form0} />   
                        }     
                    </ScrollView>
                    <View style={{marginBottom:10}}/>
                    <Button type="warning" onPress={()=>{ Commit()}}>
                        打回订单
                    </Button>
                </View>
            );
        };
        const Commit = async () => {
            const { comment_tips } = this.state;
            if(comment_tips === '' || !comment_tips) {
                Tips('请输入打回原因');
            } else {
                Confirm(async () => {
                    const key = Toast.loading('请稍后',0);
                    const res = await Http.put(Service.order, {
                        attributes: {
                            order_status: '待修改',
                            comment_tips,
                        },
                        filter: { id: this.state.id },
                    });
                    Portal.remove(key); 
                    Tips(res.message, () => {
                        this.setState({ Reject_visible: false });
                        this.getOrderData();
                    });
                });
               
            }
        };   
        return(
            <Modal
            title="打回订单"
            transparent
            onClose={()=>
                this.setState({
                    Reject_visible:false,
                })}
            maskClosable
            visible={this.state.Reject_visible}
            closable
            >
                {InfoForm()}   
            </Modal>
        );
    }
    Modal_CancelOrder() {
        const Form0 = [
            {
                type: 'Input',
                title: '取消原因',
                onValueChange:(text)=>{this.setState({comment_tips:text})}
            },
        ];
        const InfoForm = () => {
            return(
                <View style={{height: Size.height*0.3}}>
                    <ScrollView style={{ paddingVertical: 10,flex:1 }}>
                        {
                           <Form Form={Form0} />   
                        }     
                    </ScrollView>
                    <View style={{marginBottom:10}}/>
                    <Button type="warning" onPress={()=>{ Commit()}}>
                        取消订单
                    </Button>
                </View>
            );
        };

        const Commit = async () => {
            const { comment_tips } = this.state;
            if(comment_tips === '' || !comment_tips) {
                Tips('请输入取消原因');
            } else {
                Confirm(async () => {
                    const key = Toast.loading('请稍后',0);
                    const res = await Http.put(Service.order, {
                        attributes: {
                            order_status: '已取消',
                            comment_tips,
                            cancelled_time: new Date().toString()
                        },
                        filter: { id: this.state.id },
                    });
                    Portal.remove(key); 
                    Tips(res.status === 0 ? res.message : '取消成功', () => {
                        this.getOrderData();
                        this.setState({Cancel_visible: false});
                    });
                });
               
            }
        };   
        return(
            <Modal
            title="取消订单"
            transparent
            onClose={()=>
                this.setState({
                    Cancel_visible:false,
                })}
            maskClosable
            visible={this.state.Cancel_visible}
            closable
            >
                {InfoForm()}   
            </Modal>
        );
    }
    render()
    {
        if (this.state.onLoading || this.state.noData) {
            return(
                <View style={styles.container}>
                   <LoadingPage
                    backgroundColor={'#f3f3f3'}
                    iconType={'ionicon'}
                    iconName={'md-paper'}
                    noDataTitle={'订单信息获取错误'}
                    noDataSubtitle={'点击刷新'}
                    noData={this.state.onLoading?false:this.state.noData}
                    onPress={() => {
                        this.getOrderData(); 
                    }}
                />
                </View> 
            );//
        } else {
            return(
                <MenuView 
                style={styles.container}
                menu={this.ActionButtonList()}
                >
                    <Card title={'订单状态'}>
                        {this.StatusBar()}
                    </Card>
                    {this.Modal_FinishOrder()}
                    {this.Modal_FollowOrder()}
                    {this.Modal_RejectOrder()}
                    {this.Modal_FinishOrder()}
                    {this.Modal_FollowCustomer()}
                    {this.Modal_CancelOrder()}
                    {this.renderInfo()}
                    {this.Modal_ImageInfo()}
 
                </MenuView>
             
    
            );
        }
        
    }
}


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    container: {
        flex: 1, 
        backgroundColor: '#f3f3f3',
    }

  });