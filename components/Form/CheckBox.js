import React from 'react';
import { Text, View } from 'react-native';
import { Checkbox, List, WhiteSpace } from '@ant-design/react-native';
const AgreeItem = Checkbox.AgreeItem;
const CheckboxItem = Checkbox.CheckboxItem;
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
            checked: [],
        };
    }

   render()
    {
        return(
            <View style={this.props.style}>
                <View style={{marginLeft:12,marginTop:5,marginBottom:0}}>
                    <Text style={{fontSize:14,color:'#666666'}}>{this.props.title}</Text>
                </View>
                <View style={{marginHorizontal:10, marginTop: 10,flexDirection: 'row', justifyContent:'space-between',flexWrap:'wrap'}}>
                {
                    this.props.data.map(value =>
                        <View>
                        <Checkbox
                        checked={this.state.checkBox1}
                        style={{ color: 'deepskyblue' }}
                        onChange={event => {
                            let newChecked = this.state.checked;
                            event.target.checked ?
                            newChecked.push(value)
                            :
                            newChecked = newChecked.filter(i => i !== value);
                            
                            this.setState({ checked: newChecked }, () =>this.props.onValueChange(newChecked));
                        }}
                        >
                        {typeof value === 'string' ? value : value.label}
                        </Checkbox>
                        <WhiteSpace/>
                        </View>
                    )
                }
            </View>
        </View>
        );
        /*
        return(
           
            
            
        )*/
    }
}


