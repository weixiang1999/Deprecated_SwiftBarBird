import React from 'react';
import { View,StyleSheet,TouchableOpacity,Text,ScrollView,AsyncStorage } from 'react-native';
import ListByName from '../../components/List/ListByName';
import { Portal,Toast,Modal,Button } from '@ant-design/react-native';
import SquareItem from '../../components/List/SquareItem';
import MenuView from '../../components/Common/MenuView';
import LoadingPage from '../../components/Common/LoadingPage';
import Http from '../../tools/Http';
import Form from '../../components/Form/Form';
import { Tips } from '../../tools/Normal';
export default class  extends React.Component
{
    static navigationOptions = {
        title:'门店管理',
        headerRight:(<View/>)
      };
    constructor(props) {
        super(props);
        this.state = {
          list: [],
          is_update: false,
          bar_name: '',
        };
    }
    componentDidMount() {
        this.getBarInfo();
        AsyncStorage.getItem('user_type', (err, r) => {
            this.setState({user_type: r});
        })
    }

    async getBarInfo() {
        const res = await Http.getFromAPI(Service.bar,{});
        if(res.status === 1) {
            AsyncStorage.setItem('barInfoArray', JSON.stringify(res.data));
        }
 
        this.setState({list:res.data})
        console.log(res);
    }
    listItem(item) {
        return(
            <SquareItem
            title={item.bar_name}
            subtitle={item.province+' '+item.city}
            titleSize={15}
            gap={10}
            onPress={()=>{}}
            buttonList={
                [ {
                        name: 'edit',
                        type: 'feather',
                        color: '#FFD700',
                        onPress: () => {
                            this.setState({ 
                                bar_id: item.id,
                                bar_name: item.bar_name,
                                visible: true,
                                is_update: true,
                            });
                        }
                    },]
            }
            />
        )
    }
    Modal_AddBar() {
        const FormConfig = [
            {
                type:'AreaPicker',
                title:'选择地区',
                onValueChange:async (text)=>{
                    this.setState({ province:text[0].label, city: text[1].label });
                }
            },
            {
                type: 'Input',
                title: '酒吧名',
                defaultValue: this.state.bar_name,
                onValueChange: (text) => {this.setState({bar_name: text})}
            },
        ];
        const Commit = async () => {
            const body = {
                province: this.state.province,
                city: this.state.city,
                bar_name: this.state.bar_name,
                type:'普通酒吧',
                status: '运营中'
            };
            let res;
            if(this.state.is_update) {
                res = await Http.put(Service.bar, {
                    filter: { id: this.state.bar_id },
                    attributes: body,
                });
            } else {
                res = await Http.post(Service.bar, body);
            }
            
            Tips(res.message,()=> {
                this.setState({visible: false, is_update: false, bar_name: ''}, () => {
                    this.getBarInfo();
                });
            })
            console.log(body);

        }
        return(
            <Modal
                title="配置门店信息"
                transparent
                onClose={()=>this.setState({visible:false, is_update: false, bar_name: ''})}
                maskClosable
                visible={this.state.visible}
                closable
                >
                    <View style={{padding:5,marginTop:10,}}>
                        <Form 
                            Form={ FormConfig }
                        />
                        <Button
                        style={{marginTop:5}}  
                        type='warning' 
                        onPress={()=>{
                            Commit()
                        }}>
                        <Text>确认添加</Text>
                        </Button>
                    </View>
                </Modal>
        );
    }
    render()
    {
        return(
            <MenuView 
            menu={[
                {
                    title: '添加门店',
                    visible: this.state.user_type === '区域经理',
                    icon: 'md-business',
                    color: 'gray',
                    onPress: () => this.setState({visible: true})
                  },
                ]}
            style={styles.container}>
                {this.Modal_AddBar()}
                <ScrollView style={styles.container}>
                {
                    this.state.list.map(bar=>
                    {
                        return this.listItem(bar)
                    }    
                    )
                }
                </ScrollView>
             
          
            </MenuView>
        );
    }
}



const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
    }
})