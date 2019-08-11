import React from 'react';
import { View, AsyncStorage, Text, ScrollView } from 'react-native';
import { Button} from 'react-native-elements';
import ListByName from '../../components/List/ListByName';
import SquareItem from '../../components/List/SquareItem';
import { Portal,Toast,Modal,} from '@ant-design/react-native';
import { ClassifyByKey,linking } from '../../tools/Normal';
import InfoItem from '../../components/List/InfoItem';
import Communications from 'react-native-communications';
import LoadingPage from '../../components/Common/LoadingPage';
import MenuView from '../../components/Common/MenuView';

export default class extends React.Component
{
    static navigationOptions = {
        title:'联系人',
        headerRight:<View/>
      };
    constructor(props) {
        super(props);
        this.state = {
          onLoading: true,
          visible:false,
          List: [],
        };
    }
    componentDidMount() {
        this.getStaffInfo();
    }
    async getStaffInfo() {
        this.setState({ onLoading: true });
        const res = await Http.getFromAPI(Service.user, { attributes: [ 'id', 'bar_id' ,'username', 'phone', 'user_type', 'status' ] });
        const DataByBarid = ClassifyByKey(res.data, 'bar_id');
        console.log(DataByBarid);
        const bar_res = await Http.getFromAPI(Service.bar, {
            filter: {
                bar_id: Object.keys(DataByBarid).map(i => Number(i)),
            }
        });
        if (bar_res.status === 1) {
            const List = bar_res.data.map(BarInfo => {
                const item =  {
                    title: BarInfo.bar_name,
                    bar_id: BarInfo.id,
                    subtitle1: BarInfo.province, 
                    subtitle2: BarInfo.city,
                    data: DataByBarid[String(BarInfo.id)] || [],
                };
                return item;
            });
            console.log(List);
            this.setState({ List, onLoading: false });
        } else {
            this.setState({onLoading: false, noData: true})
        }


       
    }
    openUserInfo(id)
    {
        this.setState({id: id, visible: true});
    }
    async UserAllInfo()
    {
        const user_type = await AsyncStorage.getItem('user_type');
        this.setState({visible: false});
        if(user_type !== '销售员') {
            this.props.navigation.navigate('userinfo', {id: this.state.id});
        }
    }

    listItem(item)
    {
        return(
            <SquareItem
            title={item.username}
            titleSize={15}
            subtitleSize={11}
            gap={10}
            onPress={()=>this.openUserInfo(item.id)}
            subtitle={item.user_type+ ' ' +item.status}
            buttonList={
                [
                    {
                        name:'message-circle',
                        type:'feather',
                        color:'#32CD32',
                        onPress:()=>{Communications.text(item.phone)}
                    },
                    {
                        name:'phone',
                        type:'feather',
                        color:'#6495ED',
                        onPress:()=>{linking('tel:'+item.phone)}
                    },

                ]
            }
            />
        )
    }

    render()
    {
        if(this.state.onLoading) {
            return(
                <View style={{flex:1, backgroundColor: '#f5f5f5'}}>
                <LoadingPage
                    iconType={'ionicon'}
                    iconName={'md-people'}
                    iconColor={'#33CCFF'}
                    noDataTitle={'没有联系人'}
                    noData={this.state.noData}
                    onPress={async () => {
                    }}
                />

                </View>  
            );
        } else {
            return(
                <MenuView>
                    <Modal
                    title="用户信息"
                    transparent
                    onClose={()=>this.setState({visible:false})}
                    maskClosable
                    visible={this.state.visible}
                    closable
                    >
                        <View style={{padding:5,marginTop:20,}}>
                            <Button title="详细信息" onPress={()=>{this.UserAllInfo()}}/>
                        </View>
                    </Modal>
                    <ScrollView style={{flex: 1}}>
                    {
                        this.state.List.map(bar=>
                            <ListByName
                            list={bar}
                            renderItem={(item)=>this.listItem(item)}
                        />)
                    }
                    </ScrollView>
                </MenuView>
    
            );
        }   
    }
}


