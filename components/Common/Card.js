import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import { Card,WhiteSpace,WingBlank} from '@ant-design/react-native';
import {Size} from '../../tools/Normal';
/*
已完成
 <Card
                style={{flex:1,}}
                title='今日数据'>
                <Text>你好</Text>
                <Text>你好</Text>
                <Text>你好</Text>
                <Text>你好</Text>
                <Text>你好</Text>
                <Text>你好</Text>
                </Card>
*/
const styles=StyleSheet.create({
    Container:
    {
        margin: 5,
        //width:Size.width-10,
        //backgroundColor:'#F5F5F5'
    },

});
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
    }

   render()
    {
        return(
           <View style={{...styles.Container,}}>
                <Card>
                    <Card.Header
                    title={<Text style={{fontWeight:'200'}}>{this.props.title}</Text>}
                    extra={this.props.subtitle}
                    />
                    <Card.Body style={{...this.props.style}}>
                        {this.props.children}
                    </Card.Body>
                    {
                        this.props.foot||this.props.extraFoot?
                        <Card.Footer
                        content={this.props.foot||''}
                        extra={this.props.extraFoot||''}
                        />
                        :
                        <View/>
                    }
                   
                </Card>
            </View>
            
        )
    }
}
