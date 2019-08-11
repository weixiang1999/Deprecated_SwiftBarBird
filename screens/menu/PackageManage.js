import React from 'react';
import { View, StyleSheet, AsyncStorage, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import ListByName from '../../components/List/ListByName';
import { Portal, Toast, Modal, Button } from '@ant-design/react-native';
import InfoItem from '../../components/List/InfoItem';
import SquareItem from '../../components/List/SquareItem';
import LoadingPage from '../../components/Common/LoadingPage';
import Http from '../../tools/Http';
import Service from '../../tools/Service';
import { ClassifyByKey, Tips, Confirm } from '../../tools/Normal';
import Form from '../../components/Form/Form';

export default class  extends React.Component
{
    static navigationOptions = {
        title:'套餐管理',
        headerRight:(<View/>)
      };
    constructor(props) {
        super(props);
        this.state = {
          onLoading: true,
          value: '',
          visible: false,
          List: [],
          package_id: 0,
          package_name: '',
          package_price: '',
          tips: '',
          isCreate: false,
          noData: false,
        };
    }
    componentDidMount() {
        this.getPackageInfo();
        AsyncStorage.getItem('user_type', (err, result) => {
            this.setState({user_type: result});
        });
    }
    async getPackageInfo() {
        this.setState({ onLoading: true });
        const res = await Http.get(Service.package);
        if (res.status === 1) {
            const DataByBarid = ClassifyByKey(res.data, 'bar_id');
            console.log(DataByBarid);
            const BarInfoList = await Http.getFromAPI(Service.bar, { attributes: [ 'id', 'bar_name', 'province', 'city' ] });
            console.log(BarInfoList);
            const List =  BarInfoList.data.map(BarInfo => {
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
            this.setState({ List, onLoading: false, noData: false });
        } else {
            this.setState({
                noData: true,
                onLoading: false,
            })
        }
    }
    async changeInfo() {
        const CHECK = this.state.package_name === '' && Tips('套餐名不能为空') || this.state.package_price === '' && Tips('套餐价格不能为空')
                    || this.state.first_cost === '' && Tips('成本价不能为空');
        if (CHECK) return;
        if (!this.state.isCreate) {
            const res = await Http.put(Service.package, {
                filter: { id: this.state.package_id },
                attributes: {
                    package_name: this.state.package_name, 
                    package_price: this.state.package_price,
                    first_cost: this.state.first_cost,
                    bar_id: this.state.bar_id,
                    tips: this.state.tips,
                },
            });
            Tips(res.message, () => { this.setState({ visible: false });this.getPackageInfo() });
        } else {
            const res = await Http.post(Service.package, {
                package_name: this.state.package_name, 
                package_price: this.state.package_price,
                first_cost: this.state.first_cost,
                bar_id: this.state.bar_id,
                tips: this.state.tips,
            });
            Tips(res.message, () => { this.setState({ visible: false });this.getPackageInfo() });
        }
       
    }
    async deleteInfo(package_id) {
        Confirm(async ()=>{
            const res = await Http.put(Service.package, { filter: { id: package_id }, attributes: { status: '已停用' } });
            Tips(res.message, () => this.getPackageInfo());
        });
    }
    async AddPackage(bar_id) {
        console.log(bar_id);
        this.setState({ 
            package_name: '',
            package_price: '',
            first_cost: '',
            tips: '',
            bar_id,
            visible: true,
            isCreate: true,
        });
    }
    listItem(item) { 
        return(
            <SquareItem
            title={item.package_name}
            subtitle={item.package_price+'元 '+item.tips}
            titleSize={15}
            subtitleSize={11}
            gap={10}
            onPress={() => {}}
            buttonList={
                this.state.user_type !== '销售员'
                ?
                [
                    {
                        name: 'edit',
                        type: 'feather',
                        color: '#FFD700',
                        onPress: () => {
                            this.setState({ 
                                package_id: item.id,
                                package_name: item.package_name,
                                package_price: item.package_price,
                                first_cost: item.first_cost,
                                tips: item.tips,
                                bar_id: item.bar_id,
                                visible: true,
                                isCreate: false,
                            });
                        }
                    },
                    {
                        name: 'trash-2',
                        type: 'feather',
                        color: 'orangered',
                        onPress: () => {
                            this.deleteInfo(item.id);
                        }
                    },
                ]
                :[]
            }
            />
        )
    }

    AddPackageComponent() {
        const FormConfig = [
            {
                type: 'Input',
                title: '套餐名',
                defaultValue: this.state.package_name,
                onValueChange: (text) => {this.setState({package_name: text})}
            },
            {
                type: 'Input',
                title: '价格',
                defaultValue: this.state.package_price,
                onValueChange: (text) => {this.setState({package_price:text})}
            },
            {
                type: 'Input',
                title: '成本价格',
                visible: this.state.isCreate,
                defaultValue: this.state.first_cost,
                onValueChange: (text) => {this.setState({first_cost:text})}
            },
            {
                type: 'Input',
                title: '备注(可选)',
                defaultValue: this.state.tips,
                onValueChange: (text) => {this.setState({tips:text})}
            },
        ];
        return(
            <Modal
            title="配置套餐信息"
            transparent
            onClose={()=>this.setState({visible:false})}
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
                        this.changeInfo();
                    }}>
                    <Text>{this.state.isCreate?'确认添加':'确认修改'}</Text>
                    </Button>
                </View>
            </Modal>
        );
    }
    render()
    { 
        if(this.state.onLoading || this.state.noData) {
            return(
                <View style={{
                    flex:1,
                    backgroundColor:'#F5F5F5',
                }}>
                    {this.AddPackageComponent()}
                    <LoadingPage
                    iconType={'feather'}
                    iconName={'box'}
                    iconColor={'#FF8800'}
                    noDataTitle={'没有套餐'}
                    noDataSubtitle={'点击添加第一个套餐'}
                    noData={this.state.noData}
                    onPress={async () => {
                        const bar_id = await AsyncStorage.getItem('bar_id');
                        this.AddPackage(Number(bar_id));
                    }}
                    />
                </View>
            );
        } else {
            return(
                <View style={styles.container}>
                    {this.AddPackageComponent()}
                    <ScrollView style={{flex: 1}}>
                    {
                        this.state.List.map(bar=>
                            <ListByName
                            buttonList={
                                [
                                    {
                                        name: 'plus',
                                        type: 'feather',
                                        color: '#FF8888',
                                        title: '新增',
                                        onPress: () => {
                                            this.AddPackage(bar.bar_id);
                                        }
                                    },
                                ]
                            }
                            list={bar}
                            renderItem={(item)=>this.listItem(item)}
                            />)
                    }
                    </ScrollView>
                </View>
            );   
        }

        
    }
}



const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
    },
})