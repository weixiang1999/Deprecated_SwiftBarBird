import React from 'react';
import {View,StyleSheet,TextInput} from 'react-native';
import {Icon} from 'react-native-elements';


export default class TabBarIcon extends React.Component
{
    constructor(props)
    {
        super(props);

    }
    render()
    {
        return(
            <View style={styles.SearchBar}>
                <View style={{flex:1,backgroundColor:'#fff'}}>
                    <TextInput
                    placeholder={this.props.placeholder}
                    
                    />
                </View>
                <View style={{width:50,height:50}}>
                <Icon
                type='font-awesome'
                name='search'
                size={15}
                style={{marginBottom:-3}}
                color={this.props.focused?Colors.tabIconSelected:Colors.tabIconDefault}
                />
                </View>
            </View>
            
        )
    }
}




const styles=StyleSheet.create({
    SearchBar:
    {
        flex:1,
        backgroundColor:'gray',
        padding: 10,
        flexDirection: 'row',

    }
})