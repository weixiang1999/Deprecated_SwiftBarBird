import { View } from 'react-native';
import React from 'react';
import Form from '../../components/Form/Form';
export default class extends React.Component {
    
    render() {
        const FormConfig = [
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
                }
            },
            {
                type:'MuiltPicker',
                title:'选择酒吧',
                asyncData: 'barData',
                onValueChange:(text)=>{     
                    const id = this.state.barIdInfo.filter(i => i.bar_name === text[0])[0].id;
                    this.setState({bar_id:id});
                }
            }
        ]
        return (
            <Modal
                title="选择酒吧"
                transparent
                onClose={()=>this.setState({ChooseStore_visible: false})}
                maskClosable
                visible={this.props.ChooseStore_visible}
                closable
                >
                <View style={{padding:5,marginTop:20,}}>
                <Form
                Form={FormConfig}
                State={this.state}
                />
                <Button 
                type='warning' 
                onPress={()=>{this.setState({ChooseStore_visible: false}, () => {
                this.getDayData();
                setTimeout(()=> this.getChartData(),200);
                })}}
                >
                <Text>确认选择</Text>
                </Button>
                </View>
            </Modal>
        );
    }
    
}