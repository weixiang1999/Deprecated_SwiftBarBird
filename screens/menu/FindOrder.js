import React from 'react';
import { random, range } from "lodash";
import { View,StyleSheet} from 'react-native';
import { Button} from 'react-native-elements';
import { SearchBar } from '@ant-design/react-native';
export default class  extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
          value:''
        };
      }
    clear()
    {

    }
    onChange(text)
    {
        this.setState({value:text})
    }
    render()
    {
        return(
            <View style={styles.container}>

            </View>

        );
    }
}


const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
    }
})