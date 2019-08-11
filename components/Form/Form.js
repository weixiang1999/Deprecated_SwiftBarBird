import React from 'react';
import {View,StyleSheet,Text,ScrollView} from 'react-native';
import { Button } from '@ant-design/react-native';
import DoubleCheck from  './DoubleCheck';
import DropDown from './DropDownPicker';
import Input from './Input';
import Radio from './Radio';
import ImgPicker from './ImgPicker';
import Slider from './Slider';
import Stepper from './Stepper';
import PickerView from './PickerView';
import AreaPicker from './AreaPicker';
import MuiltPicker from './MuiltPicker';
import CheckBox from './CheckBox';
import DatePicker from './DatePicker';
//已完成
/*
<Form Form={this.Form}/>

this.Form=[
        {
            type:'MuiltPicker',
            title:'选择酒吧',
            asyncData:'barData',
            onValueChange:(text)=>{     
                const id = this.state.barIdInfo.filter(i => i.bar_name === text[0])[0].id;
                this.setState({regBarId:id});
            }
        }
        {
            type:'AreaPicker',
            title:'地点选择',
            onValueChange:(v)=>{}
        }
        {
            type:'PickerView',
            title:'手机号（必填）',
            data:[
                [
                    {
                    label: '13397924049',
                    value: '13397924049',
                    },
                ],

                ],
            onValueChange:(choose)=>{console.log(choose)}
        },
        {
            type:'Stepper',
            title:'选择数字',
            min:1,
            max:20,
            onValueChange:(choose)=>{
            }
        },
        {
            type:'Slider',
            title:'选择数字',
            min:1,
            max:20,
            onValueChange:(choose)=>{
            }
        },
        {
            type:'DoubleCheck',
            title:'是否',
            onValueChange:(choose)=>{
                this.Form[0].checked=choose;
                this.setState({checked:choose});
                console.log(choose);
                console.log(this.Form[0].checked)}
        },
        {
            type:'DropDown',
            title:'是否',
            content:[{
                value: 'Banana',
            }, {
                value: 'Mango',
            }, {
                value: 'Pear',
            }],
            onValueChange:(choose)=>{console.log(choose)}
        },
          {
            type:'Input',
            title:'姓名',
            editable:true,
            defaultValue:'',
            check:(text)=>text==='sb',
            rightTitle:'你是sb'(default:'错误'),
            errorTitle:'你不是sb',
            placeholder:'123',
            onValueChange:(choose)=>{console.log(choose)}
        },
        {
            type:'Input',
            title:'手机号',
            inputType:'phone',
            onValueChange:(choose)=>{console.log(choose)}
        },
        {
            type:'Radio',
            title:'多选',
            content:['一','二','三']
            onValueChange:(choose)=>{
            }
        },
    
       ]
 */
const styles=StyleSheet.create({
    container:
    {
        marginHorizontal: 5,
        padding: 1,
        //backgroundColor:'#F5F5F5'
    },

});
/**
 * 
 * @param {Object} Form
 * @param {Object} State
 */


class Form extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps() {
        /*
        this.setState({
            Form: this.props.Form,
            State: this.props.State,
        });*/
    }
    transfer = (item, index) =>
    {
        let FormItem;
        if(item.visible === undefined)
        {
            item.visible = true;
        } 
        if(item.visible) {
            switch(item.type)
            {
                case 'DoubleCheck':
                    FormItem=<DoubleCheck
                    checked={item.checked}
                    onOptionChange={(choose)=>{
                        item.onValueChange(choose)
                    }}
                    title={item.title}/>;
                    break;
                case 'DropDown':
                    FormItem= <DropDown
                    label={item.title}
                    content={item.asyncData?this.props.State[item.asyncData]:item.data}
                    onValueChange={(value)=>{
                        item.onValueChange(value);
                    }}
                    placeholder={item.placeholder}
                />;
                    break;
                case 'Input':
                    FormItem= <Input 
                    title={item.title} 
                    password={item.password||false} 
                    onChangeText={(text)=>{
                        item.onValueChange(text);
                        // this.state[item.title] = text;
                    }}
                    value={item.value}
                    changeableValue={item.changeableValue}
                    inputType={item.inputType||null}
                    check={item.check||null}
                    rightTitle={item.rightTitle}
                    errorTitle={item.errorTitle}
                    editable={item.editable||true}
                    defaultValue= {String(item.defaultValue||'')}
                    placeholder={item.placeholder||''}
                    />;
                    break;
                case 'Radio':
                    FormItem=<Radio
                    title={item.title}
                    buttons={item.content}
                    selectedIndex={item.selectedIndex}
                    onOptionChange={(options)=>{
                        item.onValueChange(options);
                    }}
                    style={{height:30,...item.style}}
                    />;
                    break;
                case 'Slider':
                    FormItem=<Slider
                    max={item.max}
                    title={item.title}
                    onValueChange={(value)=>{
                        item.onValueChange(value);
                    }}
                    />;
                    break;
                case 'Stepper':
                    FormItem=<Stepper
                    max={item.max}
                    title={item.title}
                    style={item.style}
                    onValueChange={(value)=>{item.onValueChange(value)}}
                    />;
                    break;
                case 'PickerView':
                    FormItem=<PickerView
                    title={item.title}
                    onValueChange={(value)=>{item.onValueChange(value)}}
                    data={item.data}
                    cascade={false}
                    />
                    break;
                case 'AreaPicker':
                    FormItem=<AreaPicker
                    title={item.title}
                    onValueChange={(value)=>{item.onValueChange(value)}}
                    />;
                    break;
                case 'MuiltPicker':
                    FormItem=<MuiltPicker
                    data={item.asyncData?this.props.State[item.asyncData]:item.data}
                    title={item.title}
                    col={item.col}
                    onValueChange={(value)=>{item.onValueChange(value)}}
                    />
                    break;
                case 'CheckBox': 
                    FormItem=<CheckBox
                    title={item.title}
                    data={item.data}
                    style={item.style}
                    onValueChange={(value)=>{
                        item.onValueChange(value);
                    }}
                    />
                    break;
                case 'DatePicker':
                    FormItem=<DatePicker
                    title={item.title}
                    style={item.style}
                    onValueChange={(value)=>{
                        item.onValueChange(value);
                    }}
                    />
                    break;
            }
            return FormItem;
        }
        return null;
    }
    render() {
        return(
        <View style={styles.container}>
            {this.props.Form.map((item, index) => this.transfer(item, index))}
            {
                this.props.commitButtons?
                <Button type={this.props.buttonType||'primary'} style={{marginTop: 5, marginHorizontal: 8}} onPress={()=>this.onCommit()}>
                    <Text>
                    {this.props.buttonTitle||''}
                    </Text>       
                </Button>
                :
                null
            }
            
        </View>
        )
    }

}

export default Form;