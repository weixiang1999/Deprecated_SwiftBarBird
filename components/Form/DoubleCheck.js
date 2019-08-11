import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import {CheckBox} from 'react-native-elements';
//已完成
/**
 <DoubleCheck
    checked={this.state.choose}
    onOptionChange={(choose)=>this.setState({choose:choose})}
    title={'石佛'}
/>
 */

export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            checked:undefined
        }
    }

    render()
    {
        return(
            <View>
                <View style={{marginLeft:12,marginTop:5,marginBottom:0}}>
                <Text style={{fontSize:14,color:'#666666'}}>{this.props.title}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                <CheckBox
                    center
                    title='是'
                    checkedIcon='dot-circle-o'
                    checkedColor='deepskyblue'
                    uncheckedIcon='circle-o'
                    checked={Boolean(this.state.checked)}
                    onPress={()=>{
                        this.setState({checked:true});
                        this.props.onOptionChange(true)
                    }}
                    />
                <CheckBox
                    center
                    title='否'
                    checkedIcon='dot-circle-o'
                    checkedColor='deepskyblue'
                    uncheckedIcon='circle-o'
                    checked={Boolean(!this.state.checked)}
                    onPress={()=>{
                        this.setState({checked:false});
                        this.props.onOptionChange(false);
                    }}
                />
                </View>
            </View>
            
            
        )
    }
}


