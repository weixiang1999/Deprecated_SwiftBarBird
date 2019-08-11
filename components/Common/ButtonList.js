import React from 'react';
import {View,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
/*
Buttons:[
    {
        title: string,
        visible: boolean,
        icon: string,
        color: string,
        onPress: ()=>{}
    }
]
*/
export default (props) => {
    return(
        <ActionButton 
        buttonColor="rgba(231,76,60,1)"
        >
        { 
            props.Buttons.filter(i => {
                if (typeof i.visible === 'boolean') 
                    return i.visible;
                    
            } ).map(i =>
            <ActionButton.Item buttonColor={i.color} title={i.title} onPress={() => i.onPress()}>
                <Icon name={i.icon} style={styles.actionButtonIcon} />
            </ActionButton.Item>)
        }
        </ActionButton>      
    );
}


const styles=StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
})