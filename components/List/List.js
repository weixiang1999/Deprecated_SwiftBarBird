import React from 'react';
import {StyleSheet,View,DeviceEventEmitter,FlatList,Text,ActivityIndicator,RefreshControl,TouchableWithoutFeedback } from 'react-native';
/*

*/
const styles=StyleSheet.create({
    Container:
    {
        flex:1,
    }
});
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.list=this.props.list;
        this.ListItem=this.props.ListItem;
    }

   render()
    {
        if(this.list.length===0)
        {
            return(
                <View>
                   {this.props.NoItem} 
                </View>
            )
        }
        return(
           <View style={styles.Container}>
                <FlatList
                  refreshControl={
                    <RefreshControl
                    refreshing={this.state._onRefreshing}
                    onRefresh={()=>this._refresh()}
                    title='下拉刷新'
                    progressBackgroundColor='gray'
                    tintColor='gray'
                    />
                  }
   
                  data={this.props.list}
                  renderItem={({item})=>
                    this.props.ListItem(item)
                  }
                />
           </View>   
        )
    }
}
