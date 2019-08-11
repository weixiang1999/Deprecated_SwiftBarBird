import React from 'react';
import {AsyncStorage,StyleSheet,View,TouchableOpacity} from 'react-native';
import { Text,Icon } from 'react-native-elements';
import { Size,Confirm, Tips} from '../../tools/Normal';
import { WhiteSpace, Modal, Button, Toast, Portal } from "@ant-design/react-native";
import Form from '../../components/Form/Form';
import Http from '../../tools/Http';
import Service from '../../tools/Service';
import MenuView from '../../components/Common/MenuView';



export default class Login extends React.Component
{
    static navigationOptions = {
        title:'账号管理',
        headerRight:(<View/>)
      };
    constructor(props) {
        super(props);
        this.state = { 
          addLogin_visible: false,
          userArray: [],
          currentId: 0,
        }
    }

    componentDidMount() {
        this.initUserArray();
        AsyncStorage.getItem('id', (err, id) => {
            this.setState({ currentId: Number(id) });
        })
    }

    async initUserArray() {
        const userArray = JSON.parse(await AsyncStorage.getItem('UserArray'));
        this.setState({userArray});
    }

    async changeUser(user) {
        Confirm(async () => {
            if(Number(this.state.currentId) === user.id) {
                Tips('您已经使用此账号登录');
                return;
            } else {
                const res = await Http.get(Service.loginByJWT,{ jwt: user.token });
                if(res.status === 1) {
                    await AsyncStorage.multiSet(Object.keys(user).map(key => [ key, String(user[key]) ]));
                    this.setState({currentId: res.data.id});
                    Tips('切换成功');
                } else {
                    Tips('该账号登录已经过期，请删除并添加新账号');
                }
            }
        }, '确认切换用户吗');
    }
    async deleteUser(user) {
        Confirm(async () => {
            const currentId = await AsyncStorage.getItem('id');
            console.log(currentId);
            console.log(user);
            if(Number(currentId) === user.id) {
                Tips('您正在使用此账号登录, 请先切换用户再删除');
                return;
            } else {
                const newArray = this.state.userArray.filter(i => i.id !== user.id);    
                await AsyncStorage.setItem('UserArray', JSON.stringify(newArray));
                this.setState({ userArray: newArray });  
            }
             
        }, '确认删除吗?');
    }

    async addUser(loginBody) {
        const key = Toast.loading('登录中',0);
        const res = await Http.post(Service.login, loginBody);
        console.log(res);
        if(res.status===1) {
            Portal.remove(key);
            const newArray = this.state.userArray;
            const index = newArray.findIndex(i => i.id === res.data.id);
            if(index > -1) {
                console.log('老用户');
                newArray[index] = res.data;
            } else {
                console.log('新用户');
                newArray.push(res.data);
            }
            this.setState({ userArray: newArray });
            await AsyncStorage.setItem('UserArray', JSON.stringify(newArray));
            Tips(res.message, () => this.setState({ addLogin_visible: false }));
        } else {
            Portal.remove(key);
            Tips(res.message);
        }
    }
    userItem(user)
    {
        const { username, user_type, bar_name, phone } = user;
        const { currentId } = this.state;
        const style={
            height: 70,
            backgroundColor: '#fff',
            flexDirection: 'row',
            borderBottomColor: "#ccc",
            borderBottomWidth: Size.pixel,
            borderTopColor: "#ccc",
            borderTopWidth: Size.pixel,
        };
        const left = {
            width: 40,
            justifyContent: 'center',
            alignItems:'center',
            borderRightColor: "#ccc",
            borderRightWidth:Size.pixel,
        };
        const center = {
            flex:0.6,
            paddingVertical: 20,
            justifyContent:'center'
        };
        const right = {
            flex:0.4,
            flexDirection:'row',
        };
        const button = (props) => {
            const { backgroundColor, type, icon, onPress } = props;
            const buttonStyle = {
                backgroundColor: backgroundColor, 
                flex:1,
                justifyContent: 'center',
                alignItems: 'center'
            };
            return(
                <TouchableOpacity style={buttonStyle} onPress={onPress}>
                <Icon size={22} type={type} name={icon} iconStyle={{color: '#fff'}} />
                </TouchableOpacity>
            );
        }
        const list = [
            {
                icon: 'repeat',
                type: 'feather',
                onPress: () => { this.changeUser(user) },
                backgroundColor: 'orange',
            },
            {
                icon: 'trash-2',
                type: 'feather',
                onPress: () => this.deleteUser(user),
                backgroundColor: 'tomato',
            }
        ];
        return(
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{ this.changeUser(user) }} style={style}>      
                <View style={left}>
                    <Icon name={'user'} color={'gray'} type={'feather'} size={30}/>
                </View>
                <View style={{width: 60, alignItems: 'center' ,justifyContent: 'center'}}>
                {
                    Number(currentId) === user.id ?
                    <Icon name={'check'} color={'limegreen'} type={'feather'} size={20} />  
                    :
                    null
                }
                </View>
                <View style={center}>
                    <Text style={{fontWeight:'200', fontSize: 15}}>{username}</Text>
                    <View style={{marginVertical:1}}/>
                    <Text style={{fontWeight:'200', fontSize: 12, color: 'gray'}}>{phone}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:'200', color:'orange', fontSize: 12}}>{user_type+'  '}</Text>
                        { 
                            user_type === '销售员' || user_type === '门店客服' ?
                            (<Text style={{fontWeight:'200',color:'gray', fontSize: 12}}>{bar_name}</Text>)
                            :
                            null
                        }
                    </View>
                   
                </View>
                <View style={right}>
                    {
                        list.map(i => button(i))
                    }
                </View>
            </TouchableOpacity>
        )
    }


    


    _modal_addNewLogin()
    {
        const confirmChange = async () => {
            const loginBody = {
                phone: this.state.phone,
                password: this.state.password
            }
            if(loginBody.phone==='' || loginBody.password === '') {
                Tips('账号或密码不能为空！');
            } else {
                this.addUser(loginBody);
            }
        }
        const FormConfig = [
            {
                type:'Input',
                title:'手机号',
                onValueChange:(text)=>{this.setState({phone:text})}
            },
            {
                type:'Input',
                title:'密码',
                password:true,
                onValueChange:(text)=>{this.setState({password:text})}
            },    
        ];
        return (
            <Modal
                title="新增账号"
                transparent
                onClose={()=>this.setState({addLogin_visible:false})}
                maskClosable
                visible={this.state.addLogin_visible}
                closable
                >
                <View style={{padding:5,marginTop:20,}}>
                    <Form Form={FormConfig}/>
                    <WhiteSpace size="lg" />
                    <Button 
                    type='warning' 
                    onPress={()=>confirmChange()}
                    >
                    <Text>确认</Text>
                    </Button>
                </View>
            </Modal>
        );
    }

   

    render()
    {
        return  <MenuView 
                 menu={[
                    {
                        title: '新增账号',
                        visible: true,
                        icon: 'md-create',
                        color: '#FF8888',
                        onPress: () => this.setState({addLogin_visible: true})
                    },
                ]}
                style={styles.container}>
                    {this.state.userArray.map(i => this.userItem(i))}
                    {this._modal_addNewLogin()}
                </MenuView>
    }

}


const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
    },
})