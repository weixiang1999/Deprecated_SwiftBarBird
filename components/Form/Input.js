import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import {Input} from 'react-native-elements';

//已完成
/*
<Input title='hello' />
 */

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            check:true,
            text:'',
        }
    }
    componentWillReceiveProps(){
        this.setState({text:this.props.value})
    }
    check(text)
    {
        if(this.props.inputType)
        {
            switch(this.props.inputType)
            {
                case 'phone':
                    if(/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/.test(text)===true)
                        this.setState({check:true});
                    else
                        this.setState({check:false});
                    break;
            }
        }
        else if (this.props.check)
        {
            this.setState({check:this.props.check(text)});
        }
        else
        {
            this.setState({check:null});
        }
    }
    checkTips()
    {
        if(this.state.check===null)
        {
            return <View/>
        }
        else
        {
            return (
                <Text style={{fontSize:14,color:this.state.check?'limegreen':'darkorange'}}>{this.state.check?this.props.rightTitle||'':this.props.errorTitle||'错误'}</Text>
            )
        }
       
    }
   render()
    {
        return(
            <View style={{marginBottom:5,}}>
            {
                this.props.title?
                <View style={{marginLeft:12,marginBottom:-1,flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'flex-start'}}>
                            <Text style={{fontSize:14,color:'#666666'}}>{this.props.title}</Text>
                        </View>
                        <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}>
                            {
                                this.state.text===''?<View></View>:this.checkTips()
                            }
                        </View>
                
                </View>
                :null
            }
            <Input
            secureTextEntry={this.props.password}
            placeholder={this.props.placeholder}
            inputContainerStyle={{borderBottomColor:'#A9A9A9',borderBottomWidth:0.3}}
            onChangeText={(text)=>{
                this.setState({text},()=>{ this.check(text); }); 
                this.props.onChangeText(text);
            }}
            editable = {this.props.editable||true}
    
            defaultValue = { this.props.defaultValue||''}
            />
                
            </View>)
    }
}


