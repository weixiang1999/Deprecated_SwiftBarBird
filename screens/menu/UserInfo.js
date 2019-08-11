import React from 'react';
import { View,StyleSheet,TouchableOpacity,Text,ScrollView, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from '@ant-design/react-native';
import { Overlay } from 'react-native-elements';
import Card from '../../components/Common/Card';
import InfoItem from '../../components/List/InfoItem';
import Http from '../../tools/Http';
import Service from '../../tools/Service';
import { Confirm, Tips } from '../../tools/Normal';
const Trans = {
    username: '用户名',
    user_type: '用户类型',
    created_time: '注册时间',
    idcard_photo_id_0: '身份证正面',
    idcard_photo_id_1: '身份证反面',
    phone: '注册手机号',
    phone_for_message: '接受短信手机号',
    status: '用户状态',

};
export default class  extends React.Component
{
    static navigationOptions = {
        title:'用户详情',
        headerRight:(<View/>)
      };
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{},
            Image_visible: false,
            image_loading: false,
            uri: '',
        };
        this.Id = this.props.navigation.getParam('id');
        console.log(this.Id);
    }
    componentDidMount()
    {
        this.getInfo();
    }
    async GetImageInfo(photo_id) {
        const PhotoRes = await Http.get(Service.img, { id: photo_id });
        PhotoRes.status === 1 && ( this.setState({ uri: Service.host + PhotoRes.data.path, image_loading: true, Image_visible: true }) );
      }
    async getInfo() {
        const res = await Http.getFromAPI(Service.user, {
            filter: {
                id: this.Id,
            },
        });
        this.setState({userInfo: res.data[0]})
        // console.log(res);
    }
    renderInfo() {
        const InfoConfig = {
            用户信息: {
                children: [
                    'username','phone','phone_for_message',
                    {
                        key:'status',
                        valueColor: 'orange',
                        onPress: () => {
                            Confirm(async ()=>{
                                const res = await Http.put(Service.user, {
                                    filter: { id: this.Id },
                                    attributes: {
                                        status: '已通过',
                                    }
                                });
                                Tips(res.message, ()=> {
                                    this.getInfo();
                                });
                            }, '是否通过审核');
                        }
                    }, 'user_type', 
                    {
                        key: 'idcard_photo_id_0',
                        value: '点击查看',
                        valueColor: 'orange',
                        onPress: () => {
                            this.GetImageInfo(this.state.userInfo.idcard_photo_id_0);
                        } 
                    }, 
                    {
                        key: 'idcard_photo_id_1',
                        value: '点击查看',
                        valueColor: 'orange',
                        onPress: () => {
                            this.GetImageInfo(this.state.userInfo.idcard_photo_id_1);
                        } 
                    }, 
                ],
            },
        };
        const renderList = (list) => {
            const { userInfo } = this.state;
            return list.map(item => {
                switch(typeof(item)) {
                    case 'string':
                    {
                        return <InfoItem label={Trans[item]} value={userInfo[item]}/>
                    }
                    case 'object':
                    {
                        return <InfoItem 
                                label={item.label || Trans[item.key]} 
                                value={item.value || userInfo[item.key]} 
                                valueStyle={{color:item.valueColor}} 
                                onPress={item.onPress}
                                trans={item.trans}
                                />
                    }
                }
            })
        }
        return(
                <Card title={'用户信息'}>
                     {renderList(InfoConfig['用户信息'].children)}
                </Card>
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
                }}
                onLoad={()=>{this.setState({image_loading:false})}}
                style={{width:320,height:240,borderRadius:10}}
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
        return(
            <View style={{flex:1}}>
                {this.renderInfo()}
                {this.Modal_ImageInfo()}
            </View>

        );
    }
}


