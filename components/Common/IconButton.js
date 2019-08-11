import {View,Text,TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements';
export default (name,type,color,onPress=()=>{},size,title) => {
    return(
        <TouchableOpacity 
        style={{ 
            paddingHorizontal: 5, 
            marginBottom: 5, 
            borderWidth: 1,
            borderColor: color,
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        }} 
        onPress={()=>{ onPress() }}>
        <Icon name={name||'plus'} color={color||'#FF8800'} type={type||'feather'} size={size||25}/>
        <Text style={{fontWeight:'200', color}}>
            {title}
        </Text>
        </TouchableOpacity>
    )
}