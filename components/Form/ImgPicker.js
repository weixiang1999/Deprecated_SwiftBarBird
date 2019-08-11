import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import React from 'react';
import {View,Alert,Platform} from 'react-native';
import {Button} from 'react-native-elements';
import { ActionSheet } from '../../tools/Normal';
/*
<ImgPicker
title='hello'
titleForChoosed='已选择'
buttonStyle={{backgroundColor:'blue'}}
onImgChange={(img)=>console.log(img)}/>
*/


let Image = {
    width: 800,
    height: 600,
}
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            hasChoosed:false,
        }
        this.ButtonStyle = {
            margin:10,
            backgroundColor:'#FFBB66' 
        }
        this.ButtonStyleForChoosed = {
            margin:10,
            backgroundColor:'limegreen' 
        }
        Image = this.props.ImageOptions || Image;
        if (this.props.style) {
            this.ButtonStyle = { ...this.ButtonStyle, ...this.props.style } ;
            this.ButtonStyleForChoosed = { ...this.ButtonStyleForChoosed, ...this.props.style } ;
        }
    }
    pickphoto=
    {
        _openPicker:()=> {
        ImagePicker.openPicker({
            width: Image.width,
            height: Image.height,
            cropping: true,
            cropperChooseText:'裁剪并选择',
            cropperCancelText:'取消'
        }).then(image => {
            ImageResizer.createResizedImage(image.path, Image.width/2, Image.height/2, 'JPEG', 80)
            .then(res=>
                {
                    this.props.onImgChange(res);
                    console.log(res);
                    this.setState({hasChoosed:true});
                })     
        })},
        _openCamera :()=> {
            ImagePicker.openCamera({
                width: Image.width,
                height: Image.height,
                cropping: true
            }).then(image => {
            ImageResizer.createResizedImage(image.path, Image.width/2, Image.height/2, 'JPEG', 90)
            .then(res=>
                {
                    this.props.onImgChange(res);
                    this.setState({hasChoosed:true});
                })     
            });
        }
    }

    onChoose() {
        const Buttons = [{
            title:'相机拍摄',
            onPress:()=>this.pickphoto._openCamera()
        },
        {
            title:'从相册中选取',
            onPress:()=>this.pickphoto._openPicker()
        },];
        ActionSheet('选择照片来源', Buttons);
        
    }
    render() {
        if (this.state.hasChoosed === false) {        
            return (
            <Button 
            title={this.props.title}
            onPress={()=>{this.onChoose()}}
            titleStyle={{fontSize:this.props.fontSize||10}}
            buttonStyle={this.ButtonStyle}
            />
            )
        } else {
            return (
            <Button title={this.props.titleForChoosed}
            onPress={()=>{this.onChoose()}}
            titleStyle={{fontSize:this.props.fontSize||10}}
            buttonStyle={this.ButtonStyleForChoosed}
            />
            )
        }
    }
}