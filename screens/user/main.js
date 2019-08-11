import React from 'react';
import {AsyncStorage,StyleSheet,View,TouchableOpacity,Platform,ScrollView} from 'react-native';
import { Text,Icon } from 'react-native-elements';
import { Size,Confirm, Tips, Mock } from '../../tools/Normal';
import Item from '../../components/List/ButtonListItem';
import InfoItem from '../../components/List/InfoItem';
import {WhiteSpace,Modal,Button,Portal,Toast,Progress} from "@ant-design/react-native";
import Form from '../../components/Form/Form';
import Http from '../../tools/Http';
import Service from '../../tools/Service';
import CodePush from 'react-native-code-push';
const infos = ['username','user_type','phone','phone_for_message','bar_name'];


export default class Login extends React.Component
{
    static navigationOptions = {
        title:'我的',
      };

    constructor(props) {
        super(props);
        this.state = { 
            username:'',
            user_type:'',
            phone:'',
            phone_for_message:'',
            bar_name:'',
            province: '',
            city: '',
            bindPhone_visible: false,
            bindWechat_visible: false,
            changePassword_visible: false,
            myInfo_visible: false,
            appInfo_visible: false,
            update_visible:false,
            oldPassword: '',
            newPassword: '',
            twiceInput: '',
            newPhone: '',
            idcard: '',
            updatePercent:0,
        }
    }

    componentDidMount(){
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.getUserInfo();
        });
    }
    getUserInfo() {
        AsyncStorage.multiGet(infos,(err,result)=>{
            console.log(result)
            let info = {}
            result.forEach(i=>{
                info[i[0]]=i[1];
            });
            this.setState({...info});
        })
    }

    _userInfo()
    {
        const style={
            height:Size.height*0.17,
            backgroundColor:'#fff',
            flexDirection:'row',
            borderBottomColor:"#ccc",
            borderBottomWidth:Size.pixel,
            borderTopColor:"#ccc",
            borderTopWidth:Size.pixel,
        }
        const left={
            width:120,
            justifyContent: 'center',
            alignItems:'center',
            borderRightColor: "#ccc",
            borderRightWidth:Size.pixel,
        }
        const right={
            flex:1,
            paddingLeft: 30,
            paddingVertical: 20,
            justifyContent:'center'
        }
        const { username, user_type, bar_name } = this.state;
        return(
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.setState({myInfo_visible:true})}>
                <View style={style}>       
                    <View style={left}>
                        <Icon name={'user'} color={'gray'} type={'feather'} size={50}/>
                    </View>
                    <View style={right}>
                        <Text h4 style={{fontWeight:'200'}}>{username}</Text>
                        <View style={{marginVertical:5}}/>
                        <Text h5 style={{fontWeight:'200',color:'gray'}}>{user_type}</Text>
                       
                        { 
                            user_type === '销售员' || user_type === '门店客服' ?
                            (<View style={{marginVertical:1}}>
                             <Text h5 style={{fontWeight:'200',color:'gray'}}>{bar_name}</Text>
                            </View>)
                            :
                            null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _logout()
    {
        Confirm(()=>{
            AsyncStorage.multiRemove([...infos,'token']);
            this.props.navigation.navigate('Login');
          }
        )
    }

    checkForUpdate() {
        const key = Platform.OS === 'ios' ? 
        'XHJG0UyvUosCQSAzXWNwMD1CEyz64ksvOXqog': 
        'b3uELveDmD10hJXNZsVvWka5nzW64ksvOXqog';
        let loadingModal;
        let loading = 0;
        CodePush.sync({
            //安装模式
            //ON_NEXT_RESUME 下次恢复到前台时
            //ON_NEXT_RESTART 下一次重启时
            //IMMEDIATE 马上更新
            deploymentKey: key,
            installMode : CodePush.InstallMode.IMMEDIATE ,
            //对话框
            updateDialog : {
              //是否显示更新描述
              appendReleaseDescription : true ,
              //更新描述的前缀。 默认为"Description"
              descriptionPrefix : "更新内容：" ,
              //强制更新按钮文字，默认为continue
              mandatoryContinueButtonLabel : "立即更新" ,
              //强制更新时的信息. 默认为"An update is available that must be installed."
              mandatoryUpdateMessage : "必须更新后才能使用" ,
              //非强制更新时，按钮文字,默认为"ignore"
              optionalIgnoreButtonLabel : '稍后' ,
              //非强制更新时，确认按钮文字. 默认为"Install"
              optionalInstallButtonLabel : '后台更新' ,
              //非强制更新时，检查到更新的消息文本
              optionalUpdateMessage : '有新版本了，是否更新？' ,
              //Alert窗口的标题
              title : '更新提示'
            } ,
          }, (syncStatus) => {
              
              switch(syncStatus) {
                  case 0:
                    Portal.remove(loadingModal);
                    loading = 0;
                    Tips('应用已经是最新版本！');
                    break;
                  case 1:
                    CodePush.restartApp();
                    loading = 0;
                    break;
                  case 3:
                    Portal.remove(loadingModal);
                    Tips('机器没有联网或者更新服务器出错');
                    loading = 0;
                    break;
                    // 
                  case 4: 
                    Portal.remove(loadingModal);
                    Tips('网络繁忙，请过段时间再试');
                    loading = 0;
                    break;
                  case 5:
                    loadingModal = Toast.loading('检查更新中',0);
                    loading = 1;
                    setTimeout(() => {
                        if(loading === 1) {
                            Portal.remove(loadingModal);
                            Tips('服务器正忙，请稍后再试!');
                        }
                    }, 5000);
                    break;
                  case 6:
                    loading = 0;
                    Portal.remove(loadingModal);
                    break;
                  case 7:
                    Portal.remove(loadingModal);
                    this.setState({ update_visible: true });
                    break;
              }
              console.log('更新'+ syncStatus);
          }, (progress) => {
              this.setState({ updatePercent: Math.floor(progress.receivedBytes/progress.totalBytes*100) });
          });
    }
    _modal_myInfo()
    {
        return (
            <Modal
                title="我的信息"
                transparent
                onClose={()=>this.setState({myInfo_visible:false})}
                maskClosable
                visible={this.state.myInfo_visible}
                closable
                >
                <View style={{padding:5,marginTop:20,}}>
                    <InfoItem label={'姓名'} value={this.state.username}/>
                    <InfoItem label={'绑定手机号'} value={this.state.phone_for_message}/>
                </View>
            </Modal>
        );
    }

    _modal_changePassword()
    {
        const confirmChange = async () => {
            if (this.state.newPassword === '') {
                Tips('密码不能为空');
            } else if(this.state.newPassword !== this.state.twiceInput) {
                Tips('两次输入不一致');
            } else {
                const body = { userinfo_id: await AsyncStorage.getItem('id'), oldPassword: this.state.oldPassword, newPassword: this.state.newPassword };
                console.log(body);
                const res = await Http.post(Service.changePassword, body);
                if (res.status === 1) {
                    Tips(res.message+',请重新登录', () => {
                        AsyncStorage.multiRemove([...infos,'token']);
                        this.props.navigation.navigate('Login');
                    });
                } else {
                    Tips(res.message);
                }
            }
        }
        const FormConfig = [
            {
                type:'Input',
                title:'原密码',
                onValueChange:(text)=>{this.setState({oldPassword:text})}
            },
            {
                type:'Input',
                title:'新密码',
                password:true,
                check:(text)=>text.length>=8,
                rightTitle:'',//(default:'错误'),
                errorTitle:'密码长度太短',
                onValueChange:(text)=>{this.setState({newPassword:text})}
            },
            {
                type:'Input',
                title:'再次输入密码',
                password:true,
                check:(text)=>text===this.state.newPassword,
                rightTitle:'',//(default:'错误'),
                errorTitle:'两次输入不一致',
                onValueChange:(text)=>{this.setState({twiceInput:text})}
            },
        
           ]
        return (
            <Modal
                title="修改密码"
                transparent
                onClose={()=>this.setState({changePassword_visible:false})}
                maskClosable
                visible={this.state.changePassword_visible}
                closable
                >
                <View style={{padding:5,marginTop:20,}}>
                    <Form Form={FormConfig}/>
                    <WhiteSpace size="lg" />
                    <Button 
                    type='warning' 
                    onPress={()=>confirmChange()}
                    >
                    <Text>确认修改</Text>
                    </Button>
                </View>
            </Modal>
        );
    }
    _modal_update()
    {
        return (
            <Modal
                title="更新中"
                transparent
                onClose={()=>this.setState({update_visible :false})}
                maskClosable
                visible={this.state.update_visible}
                closable
                >
                <View 
                style={{marginTop: 30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',}}
                >
                <View style={{ marginRight: 10, height: 2, flex: 1 }}>
                    <Progress percent={this.state.updatePercent} />
                </View>
                <Text>{this.state.updatePercent+'%'}</Text>
                </View>
              
            </Modal>
        );
    }
    _modal_bindPhone()
    { 
        const FormConfig = [
            {
                type: 'Input',
                title: '新手机号',
                inputType: 'phone',
                errorTitle:'手机号格式有误',
                onValueChange: (text) => { this.setState({newPhone: text}) }
            },
           ]
        const changePhoneForMessage = async () => {
            console.log(123);
            if( this.state.newPhone === '')
            {
                Tips('手机号不能为空！');
                return;
            }
            const res = await Http.put(Service.user,{attributes:{
                phone_for_message: this.state.newPhone,
            }});
            if (res.status === 1) {
                Tips(res.message, () => { 
                    AsyncStorage.setItem('phone_for_message', this.state.newPhone);
                    this.setState({phone_for_message: this.state.newPhone, bindPhone_visible: false}); 
                });
            } else {
                Tips(res.message,);
            }
        }
        return (
            <Modal
                title="绑定手机号"
                transparent
                onClose={()=>this.setState({bindPhone_visible:false})}
                maskClosable
                visible={this.state.bindPhone_visible}
                closable
                >
                <View style={{padding:5,marginTop:20,}}>
                <View style={{marginLeft:17,marginBottom:10}}>
                    <Text style={{color:'gray'}}>
                        原手机号:{this.state.phone_for_message}
                    </Text>
                </View>
                    <Form
                    Form={FormConfig}
                    />
                    <Button 
                    type='warning' 
                    onPress={()=>{
                        Confirm(changePhoneForMessage,'绑定的新手机号为:'+this.state.newPhone);
                    }}
                    >
                    <Text>确认修改</Text>
                    </Button>
                </View>
            </Modal>
        );
    }

    _modal_bindWechat()
    {
        const FormConfig = [
            {
                type: 'Input',
                title: '新微信号',
                inputType: 'phone',
                onValueChange: (text) => { this.setState({newPhone:text}) }
            },
           ]
        return (
            <Modal
                title="绑定微信号"
                transparent
                onClose={()=>this.setState({bindWechat_visible:false})}
                maskClosable
                visible={this.state.bindWechat_visible}
                closable
                >
                <View style={{padding:5,marginTop:20,}}>
                <View style={{marginLeft:17,marginBottom:10}}>
                    <Text style={{color:'gray'}}>
                        原微信号:{this.state.oldWechat}
                    </Text>
                </View>
                    
                    <Form
                    Form={FormConfig}
                    />
                    <Button 
                    type='warning' 
                    onPress={()=>{Tips('暂未开放')}}
                    >
                    <Text>确认修改</Text>
                    </Button>
                </View>
            </Modal>
        );
    }

    _modal_appInfo()
    {
        return (
            <Modal
                title="关于本产品"
                transparent
                onClose={()=>this.setState({appInfo_visible:false})}
                maskClosable
                visible={this.state.appInfo_visible}
                closable
                >
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <Text>版本号:v2.1.1</Text>
                <Text>本产品由上海载瑞实业有限公司开发</Text>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
            </Modal>
        );
    }
//      <Item icon={'upload-cloud'} color={'#F08080'} title={'检查更新'} type={'feather'} onPress={()=>this.checkForUpdate()}></Item>
    render()
    {
        return (
        <ScrollView style={styles.container}>
            {this._modal_myInfo()}
            {this._modal_bindPhone()}
            {this._modal_bindWechat()}
            {this._modal_changePassword()}
            {this._modal_appInfo()}
            {this._modal_update()}
            <WhiteSpace size="lg" />
            <View>
                {this._userInfo()}
            </View>
            <View>
                <WhiteSpace size="lg" />
                <Item icon={'edit'} color={'darkorange'} title={'修改密码'} type={'feather'} onPress={()=>this.setState({changePassword_visible:true})}></Item>
                <Item icon={'message-circle'} color={'#32CD32'} title={'绑定微信号'} type={'feather'} onPress={()=>this.setState({bindWechat_visible:true})}></Item>
                <Item icon={'phone-incoming'} color={'cornflowerblue'} title={'绑定手机号'} type={'feather'} onPress={()=>this.setState({bindPhone_visible:true})}></Item>
                <Item icon={'upload-cloud'} color={'#F08080'} title={'检查更新'} type={'feather'} onPress={()=>this.checkForUpdate()}></Item>
                <Item icon={'info'} color={'darkgray'} title={'关于本软件'} type={'feather'} onPress={()=>this.setState({appInfo_visible:true})}></Item>

                <WhiteSpace size="lg" />
                <Item icon={'repeat'} color={'gold'} title={'账号切换'} type={'feather'} onPress={()=>this.props.navigation.navigate('loginManage')}></Item>
                <Item icon={'log-out'} color={'tomato'} title={'退出登录'} type={'feather'} onPress={()=>this._logout()}></Item>
            </View>
        </ScrollView>)
    }

}


const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        
    },
    header:{
    
        backgroundColor:'#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: Size.pixel,
        flexDirection: 'row',
    },
    background:{
        width: '100%', 
        height: '100%',
        alignItems: 'center',
    }
})