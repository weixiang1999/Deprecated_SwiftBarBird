import React from 'react';
import {View,StyleSheet,Text,TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import {Size} from '../../tools/Normal';
import * as Animatable from 'react-native-animatable';
/*
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

*/
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        // console.log(this.props);
    }
    render()
    {
        if (this.props.noData) {
            return(
            <TouchableWithoutFeedback onPress={()=>this.props.onPress()}>
                <View style={{
                    marginTop: Size.height*0.3,
                    backgroundColor: this.props.backgroundColor||'#F5F5F5',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Icon
                    type={this.props.iconType||'font-awesome'}
                    name={this.props.iconName||'search'}
                    size={100}
                    style={{}}
                    color={'gray'}
                    />
                    <View style={{marginTop:10}}/>
                    <Text style={{color:'gray',fontSize:17}}>{this.props.noDataTitle||''}</Text>
                    <View style={{marginTop:5}}>
                    <Text style={{color:'gray',fontSize:10}}>{this.props.noDataSubtitle||''}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            );
        } else {
            return(  
                <Animatable.View
                animation="fadeIn"
                iterationCount={'infinite'}
                duration={1500}
                easing={'linear'}
                direction="alternate">
                <View style={{
                    marginTop: Size.height*0.3,
                    backgroundColor: this.props.backgroundColor||'#F5F5F5',
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <Icon
                    type={this.props.iconType||'font-awesome'}
                    name={this.props.iconName||'search'}
                    size={100}
                    style={{}}
                    color={this.props.iconColor||'#FFBB00'}
                    />
                    <View style={{marginTop:10}}/>
                    <Text style={{color:'gray',fontSize:17}}>加载中...</Text>
                    <View style={{marginTop:5}}>
                    <Text style={{color:'gray',fontSize:10}}>请稍后</Text>
                    </View>
                </View>
                    
                </Animatable.View>
            )
        }
        
    }
}




const styles=StyleSheet.create({
    container:
    {
        marginTop: Size.height*0.3,
        backgroundColor:'#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',

    }
})