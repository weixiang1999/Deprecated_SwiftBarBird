import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
//已完成
/**
 let buttons=['一','二','三']
        return ( 
        <View style={styles.container}>            
            <Radio
            title={'选择'}
            buttons={buttons}
            selectedIndex={this.state.selectedIndex}
            onOptionChange={(options)=>this.setState({selectedIndex:options})}
            style={{height:30,}}
            />
            
        </View>)
 */

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            selectedIndex:this.props.selectedIndex !== undefined ? this.props.selectedIndex : undefined
        }
    }

   render()
    {
        return(
            <View style={{marginVertical:5}}>
               {
                   this.props.title?
                    <View style={{marginLeft:12,marginBottom:5}}>
                    <Text style={{fontSize:14,color:'#666666'}}>{this.props.title}</Text>
                    </View>
                        :
                    <View/>
                }
                <View style={{flexDirection:'row'}}>
                <ButtonGroup
                    onPress={(option)=>{this.setState({selectedIndex:option});this.props.onOptionChange(this.props.buttons[option])}}
                    selectedIndex={this.state.selectedIndex}
                    buttons={this.props.buttons}
                    containerStyle={{...this.props.style}}
                />
                </View>
            </View>
            
            
        )
    }
}


