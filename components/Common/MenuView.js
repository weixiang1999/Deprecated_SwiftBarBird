import React from 'react';
import {View, StatusBar} from 'react-native';
import ButtonList from '../../components/Common/ButtonList';
import { Modal } from '@ant-design/react-native';
import { ObjectClone } from '../../tools/Normal';
export default class extends React.Component
{

    constructor(props)
    {
        super(props);
        const { onLoading, noData, } = this.props
        this.state = {
            onLoading,
            noData,
        };
    }
    componentDidMount() {
        // console.log(this.state);
    }
    componentWillReceiveProps() {
        // console.log(this.state);
        // console.log(this.props.state)
    }
    ActionButtonList() {
        return(
          <ButtonList 
          Buttons = {this.props.menu}
          />
        );
    }
    render()
    {
        if (this.state.onLoading) {
            <View style={{
                flex:1,
                backgroundColor:'#F5F5F5',
            }}>
                <LoadingPage
                iconType={'feather'}
                iconName={'box'}
                iconColor={'#FF8800'}
                noDataTitle={'没有套餐'}
                noDataSubtitle={'点击添加第一个套餐'}
                noData={this.state.noData}
                onPress={async () => {
                }}
                />
            </View>
        } else {
            return (
                <View style={{
                    flex:1,
                    backgroundColor:'#F5F5F5',
                    ...this.props.style
                }}>
                <StatusBar backgroundColor={'#f5f5f5'} barStyle={'dark-content'}/>
                {this.props.children}
                {this.props.menu ? this.ActionButtonList() : null}
                {this.props.modalConfig?
                 this.props.modalConfig.map(item => 
                    {
                        return (
                            <Modal
                            title={item.title}
                            transparent
                            onClose={()=>
                                this.setState({
                                    [item.title]:false,
                                })}
                            maskClosable
                            visible={this.state[item.title]}
                            closable
                            >
                                {item.children()}
                            </Modal>
                        )
                    })
                 :
                 null
                }
                </View>
            )
        }
        
    }
 
}
