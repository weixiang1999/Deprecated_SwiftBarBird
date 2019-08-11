import React from 'react';
import {View,StyleSheet,ScrollView,TouchableOpacity,DeviceEventEmitter,AsyncStorage} from 'react-native';
import Form from '../../components/Form/Form';
import {Tips,GetCurrentContact} from '../../tools/Normal';
import {Portal,Toast,Button} from "@ant-design/react-native";
import IconA from 'react-native-vector-icons/AntDesign';
import Service from '../../tools/Service';
import Http from '../../tools/Http';
export default class  extends React.Component
{
    static navigationOptions = ({ navigation }) => {
        return {
          title:'新增订单',
          headerLeft: (
            <TouchableOpacity style={{paddingLeft:15}} onPress={()=>{
                    navigation.goBack();
                    DeviceEventEmitter.emit('refreshCurrentPage');
                }}>
                <IconA name={'arrowleft'} color={'#000'} size={25}/>
            </TouchableOpacity>
          ),
          headerRight:(<View/>)
        };
      };
    constructor(props) {
        super(props);
        this.state = {
          disabled:false,
          name: '暂无',
          phone: '',
          number: 1,
          sex: '',
          requireType: '',
          phoneData:[],
          data:[
            ],
          barData:[],
          is_pre_order: false,
        };
      
      }
    componentDidMount(){
        this.getPhone();   
        AsyncStorage.getItem('user_type', (err, user_type) => {
            this.setState({user_type});
            if(user_type !== '门店客服' && user_type !== '销售员') {
                AsyncStorage.getItem('barInfoArray',(err, barInfoArray) => {
                    this.setState({barData: JSON.parse(barInfoArray)}, () => {
                    });
                });
            }
        });
    }
    async getPhone() {
        const list = await GetCurrentContact();
        console.log(list);
        this.setState({phoneData: list.map(i => i.number).slice(0,10)}); 
    }
    newOrderForm() {
        const Form0=[
            {
                type:'Input',
                title:'姓名',
                onValueChange:(text)=>{this.setState({name: text})}
            },
            {
                type:'DropDown',
                title:'门店',
                data: this.state.barData.map(i => i.bar_name),
                visible: this.state.barData.length!==0,
                onValueChange:(bar) => {
                    this.setState({ bar_id: this.state.barData.filter(i => i.bar_name === bar)[0].id});
                }
            },
            {
                type:'MuiltPicker',
                title:'手机号（必填）',
                data:this.state.phoneData,
                onValueChange:(phone)=>{
                    console.log(phone);
                    this.setState({phone:phone[0]});
                }
            },
            {
                type:'Input',
                placeholder:'手动输入',
                inputType:'phone',
                onValueChange:(phone)=>{
                    this.setState({phone:phone});
                }
            },
            {
                type:'Stepper',
                title:'人数(默认为1)',
                style:{
                    width:270,
                },
                onValueChange:(num)=>{
                    this.setState({number:num});
                }
            },
            {
                type:'Radio',
                title:'需求类型',
                content:['卡座','吧台','散台','包房'],
                style:{
                    width:270,
                },
                onValueChange:(choose)=>{
                    this.setState({require_type:choose});
                }
            },
            {
                type:'Radio',
                title:'性别',
                content:['男','女'],
                style:{
                    width:270,
                },
                onValueChange:(choose)=>{
                    this.setState({sex:choose});
                }
            },  
            {
                type:'DoubleCheck',
                title:'是否预订单',
                style:{
                    width:270,
                },
                onValueChange:(choose)=>{
                    console.log(choose);
                    this.setState({is_pre_order:choose});
                }
            },  
            {
                type:'DatePicker',
                title:'选择短信提醒日期',
                visible: this.state.is_pre_order,
                style:{
                    width:270,
                },
                onValueChange:(choose)=>{
                    this.setState({ pre_date: choose })
                }
            },  
            {
                type:'Input',
                title:'备注',
                onValueChange:(text)=>{this.setState({tips: text})}
            },
           ]
        return (
            <Form Form={Form0}/>  
        );
    }
    async addOrder() {
        const reqBody = {
            customer_name: this.state.name,
            customer_phone: this.state.phone,
            number: this.state.number,
            customer_sex: this.state.sex,
            require_type: this.state.require_type,
            tips: this.state.tips || '',
            is_reserve: '否',
        };
        if(this.state.is_pre_order === true) {
            reqBody.is_reserve = '是';
            reqBody.reserve_time = new Date(this.state.pre_date).toString();
        }
        
        if(this.state.user_type === '区域经理') {
            if(this.state.bar_id) {
                reqBody.bar_id = this.state.bar_id;
            } else {
                Tips('你还没有选择订单对应门店');
                return;
            }
        }


        if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(reqBody.customer_phone)) {
            Tips('手机号码不符合规范');
            return;
        }

        if(reqBody.customer_phone === '') {
            Tips('手机号不能为空');
        } else if(reqBody.require_type === '') {
            Tips('需求类型不能为空');
        } else if(reqBody.sex === '') {
            Tips('性别不能为空');
        } else {
            this.setState({disabled:true});
            const key = Toast.loading('请稍后',0);
            const res = await Http.post(Service.order, reqBody);
            
            if(res.status===1) {
                Portal.remove(key);
                Tips(res.message,() => {
                    this.props.navigation.goBack();
                    DeviceEventEmitter.emit('refreshCurrentPage');
                });
            } else {
                Portal.remove(key);
                Tips(res.message,()=>this.setState({disabled:false}));
            }
        }
    }
    render()
    {
        return(
            <ScrollView style={styles.container}>
                {this.newOrderForm()}
                <Button 
                type='primary'
                style = {{margin:15,}} 
                onPress = {() => { this.addOrder(); }}
                disabled = {this.state.disabled}
                >
                    提交
                </Button>
                <View style={{marginBottom: 10}}/>
            </ScrollView>

        );
    }
}


const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        paddingTop: 15,
    }
})