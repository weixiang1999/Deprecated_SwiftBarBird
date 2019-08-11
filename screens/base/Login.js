import React from 'react';
import {AsyncStorage,StyleSheet,View,ScrollView,Image,ImageBackground,TouchableHighlight,KeyboardAvoidingView, StatusBar} from 'react-native';
import { Text,Button } from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Fumi } from 'react-native-textinput-effects';
import { Size,Tips,Mock, } from '../../tools/Normal';
import { Portal,Toast,Modal,Button as ButtonA,} from '@ant-design/react-native';
import * as Animatable from 'react-native-animatable';
import Form from '../../components/Form/Form';
import ImgPicker from '../../components/Form/ImgPicker';
import Http from '../../tools/Http';
import Service from '../../tools/Service';

export default class Login extends React.Component
{
    static navigationOptions = {
        headerTitle:null,
        headerMode:'none'
    };
    constructor(props)
    {
      super(props);
      StatusBar.setHidden(true);
      this.state = { 
          loginPhone: '',
          loginPassword: '',
          regName: '',
          regPhone: '',
          regPhone_for_message:'',
          regPassword: '',
          regPasswordTwice: '',
          regIdcard: '',
          regUsertype: '',
          regBarId: '',
          regImg1: undefined,
          regImg2: undefined,

          barIdInfo: [],
          barData: [],
          phone: '',
          visible: false,
        };
      
    }
    componentWillUnmount() {
        StatusBar.setHidden(false);
    }
    componentDidMount(){
        AsyncStorage.getItem('lastPhone',(err,phone)=>{
            if(err)
            {
                console.log(err);
            }
            this.setState({phone,loginPhone:phone});
        })
    }
    _registerOpen()
    {
        this.setState({
            visible:true,
        });
    }

    
    async _register()
    {
        
        const regBody = {
            username: this.state.regName,
            phone: this.state.regPhone,
            phone_for_message: this.state.regPhone_for_message,
            password: this.state.regPassword,
            idcard: this.state.regIdcard,
            bar_id: this.state.regBarId,
            user_type: this.state.regUsertype,
        }
        const Image1 = this.state.regImg1;
        const Image2 = this.state.regImg2;

        for (let key in regBody) {
            if(regBody[key] === undefined || regBody[key] === '') {
                Tips('信息填写不完整，请检查后提交');
                return;
            }
        }
        if( !Image1 || !Image2) {
            Tips('信息填写不完整，请检查后提交');
            return;
        }
        const key = Toast.loading('请稍后',0);
        const res1 = await Http.imageUpload(Service.img, Image1, { filename: regBody.phone+regBody.idcard+'000', key1: '备注', value1: '身份证'});
        const res2 = await Http.imageUpload(Service.img, Image2, { filename: regBody.phone+regBody.idcard+'111', key1: '备注', value1: '身份证'});
        if (res1.status === 1 && res2.status === 1 ) {
            regBody.idcard_photo_id_0 = res1.data.id;
            regBody.idcard_photo_id_1 = res2.data.id;
            
            console.log(regBody);

            let res = await Http.post(Service.register, regBody);
            console.log(res);

            if(res.status===0) {
                Portal.remove(key);
                Tips(res.message);
            }
            else
            {
                Portal.remove(key);
                this.setState({visible:false},()=>{Tips(res.message);});
            }
        } else {
            Portal.remove(key);
            Tips(res1.status === 1?res2.message:res1.message);
        }
        
        
    }
    async _login()
    {
        const loginBody = {
            phone: this.state.loginPhone,
            password: this.state.loginPassword
        }
        await AsyncStorage.setItem('lastPhone',this.state.loginPhone);
        if(loginBody.phone==='' || loginBody.password === '') {
            Tips('账号或密码不能为空！');
        } else {
            console.log(loginBody);
            const key = Toast.loading('登录中',0);
            let res = await Http.post(Service.login,loginBody,);
            console.log(res);

            if(res.status===0) {
                Portal.remove(key);
                Tips(res.message);
            } else {
                Portal.remove(key);
                const oldUserArray = await AsyncStorage.getItem('UserArray');
                if(!oldUserArray) {
                    const UserArray = [ res.data ];
                    AsyncStorage.setItem('UserArray', JSON.stringify(UserArray));
                } else {
                    const newUserArray = JSON.parse(oldUserArray);
                    const index = newUserArray.findIndex(i => i.id === res.data.id);
                    if(index > -1) {
                        console.log('老用户');
                        newUserArray[index] = res.data;
                    } else {
                        console.log('新用户');
                        newUserArray.push(res.data);
                    }
                    AsyncStorage.setItem('UserArray', JSON.stringify(newUserArray));
                }
                await AsyncStorage.multiSet(Object.keys(res.data).map(key => [ key, String(res.data[key]) ]));
                this.props.navigation.navigate('App');
            }
        }
        
        
    }
    
    _regComponent()
    {
        const FormConfig = [
            {
                type: 'Input',
                title: '姓名',
                onValueChange: (text) => {this.setState({regName:text})}
            },
            {
                type: 'Input',
                title: '手机号',
                inputType: 'phone',
                errorTitle: '手机号格式有误',
                onValueChange:(text) => {this.setState({regPhone:text})}
            },
            {
                type: 'Input',
                title: '接受短信手机号',
                inputType: 'phone',
                errorTitle: '手机号格式有误',
                onValueChange:(text) => {this.setState({regPhone_for_message:text})}
            },
            {
                type:'Input',
                title:'密码',
                password:true,
                check: (text) => text.length >= 8,
                errorTitle: '密码太短',
                onValueChange:(text)=>{this.setState({regPassword:text})}
            },
            {
                type:'Input',
                title:'确认密码',
                password:true,
                check: (text) => text === this.state.regPassword,
                errorTitle: '两次输入不一致',
                onValueChange:(text)=>{this.setState({regPasswordTwice:text})}
            },
            {
                type:'Input',
                title:'身份证号',
                password:false,
                onValueChange:(text)=>{this.setState({regIdcard:text})}
            },
            {
                type:'Radio',
                title:'选择岗位',
                content:['销售员','门店客服', '区域经理'],
                style:{
                    width:230,
                },
                onValueChange:(text)=>{
                    this.setState({regUsertype:text});
                    if(text === '区域经理') {
                        this.setState({ is_area_manager: true, regBarId: 0, });
                    }
                }
            },
            {
                type:'AreaPicker',
                title:'选择地区',
                onValueChange:async (text)=>{
                    console.log(text);
                    const res = await Http.get(Service.bar,{
                        province:text[0].label,
                        city: text[1].label,
                        attributes: [ 'id', 'bar_name'],
                    });
                    // console.log(res);
                    this.setState({ barData: res.data.map(i => i.bar_name), barIdInfo: res.data });
                },
                onOk:async () => {

                }
            },
            {
                type:'MuiltPicker',
                title:'选择酒吧',
                asyncData:'barData',
                visible: !this.state.is_area_manager,
                onValueChange:(text)=>{     
                    const id = this.state.barIdInfo.filter(i => i.bar_name === text[0])[0].id;
                    this.setState({regBarId:id});
                }
            }
           ]
        return(
            
                <View style={{ paddingVertical: 10,height:0.7*Size.height }}>
                <ScrollView>
                    <Form Form={FormConfig} State={this.state} />
                    <View
                    style={{flexDirection:'row',paddingLeft:5}}>
                        <ImgPicker
                        onImgChange={(img)=>{this.setState({regImg1: img})}}
                        fontSize={10}
                        title='选择身份证正面'
                        titleForChoosed='已选择身份证正面'
                        style={{width:100, height:30}}
                        />
                        <ImgPicker
                        onImgChange={(img)=>{this.setState({regImg2: img})}}
                        fontSize={10}
                        title='选择身份证反面'
                        titleForChoosed='已选择身份证反面'
                        style={{width:100, height:30}}
                        />
                    </View>
                    <ButtonA type="ghost" onPress={()=>this._register()}>
                    注册
                    </ButtonA>  
                </ScrollView>
                    
                    
                </View>
        )
    }
    render()
    {

        return ( 
          <ImageBackground source={require('../../assets/img/blue-circle.jpg')} style={styles.backgroundColor}>
            <Modal
            title="新增用户"
            transparent
            onClose={()=>
                this.setState({
                    regBarId: '',
                    regIdcard: '',
                    regPassword: '',
                    regPasswordTwice: '',
                    regUsertype: '',
                    visible:false
                })}
            maskClosable
            visible={this.state.visible}
            closable
            >
                {this._regComponent()}   
            </Modal>
         
            <Animatable.View style={{flex:1}} animation="bounceIn" >
            <Image source={require('../../assets/img/logo.png')} style={styles.logo} />
            <View style={styles.container} >
                <Fumi
                label={'手机号'}
                iconClass={FontAwesomeIcon}
                iconName={'phone'}
                iconColor={'#A9A9A9'}
                iconSize={20}
                iconWidth={45}
                inputPadding={18}
                style={styles.input}
                value={this.state.phone}
                onChangeText={(text)=>{this.setState({loginPhone:text,phone:text})}}
                />
                <Fumi
                label={'密码'}
                iconClass={FontAwesomeIcon}
                iconName={'unlock'}
                iconColor={'#A9A9A9'}
                iconSize={20}
                iconWidth={45}
                inputPadding={18}
                style={styles.input}
                secureTextEntry={true}
                onChangeText={(text)=>{this.setState({loginPassword:text})}}
                />
                <Button 
                title='登录'
                buttonStyle={{borderRadius:15}}
                onPress={()=>this._login()}
                />
            </View>
                        
                  
                    <View style={styles.reg}>
                        <TouchableHighlight onPress={()=>this._registerOpen()}>
                        <Text style={{color:'#F5F5F5'}}>注册</Text>
                        </TouchableHighlight>
                    </View>    
       
                   
                </Animatable.View>
           
          </ImageBackground>)
    }

}


const styles=StyleSheet.create
({
  logo:{
    marginTop:0.25*Size.height,
    marginHorizontal:0.4*Size.width,
    width:0.2*Size.width,
    height:0.2*Size.width,
    borderRadius:30
  },
  backgroundColor:{
    width: '100%', 
    height: '100%',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  container:
  {
    // flex:1,
    width: 0.8*Size.width,
    height:0.4*Size.height,
    marginHorizontal: 0.1*Size.width,
    marginTop:0.1*Size.height,
    marginBottom:0.01*Size.height,
    borderRadius: 15,
    backgroundColor:'#F5F5F5',
    paddingHorizontal:20,
    paddingVertical: 7,
    justifyContent:'space-around'
    //backgroundColor:'#FFAA33'
  },
  input:{
    borderRadius:15,
    height:40,
    
  },
  reg:{
      marginTop:0.04*Size.height,
      marginBottom:0.15*Size.height,
      alignItems:'center'
  }
});