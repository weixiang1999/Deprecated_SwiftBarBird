import React from 'react';
import { StyleSheet, View, ImageBackground,TouchableOpacity,AsyncStorage } from 'react-native';
import { Text,Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { Agenda, } from 'react-native-calendars';
import { ActivityIndicator } from '@ant-design/react-native';
import AccountItem from '../../components/List/AccountItem';
var moment = require('moment');
const theme = {
  backgroundColor: '#f5f5f5',
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: 'deepskyblue',
  selectedDayTextColor: '#fff',
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: 'deepskyblue',
  arrowColor: 'orange',
  textMonthFontWeight: 'bold',
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
  agendaTodayColor: 'deepskyblue',
  agendaKnobColor: 'gray'
};

export default class extends React.Component {
  static navigationOptions = {
    title:'记账板',
    headerRight:(<View/>)
  };
    constructor(props) {
      super(props);
      this.state = {
        items: {},
        Image_visible: false,
        image_loading: true,
        uri:'',
        barData: [],
        bar_name: '',
        bar_id:'',
      };
    }
    render() {
        return (
          <View style={{flex:1}}>
            <Agenda
              items={this.state.items}
              loadItemsForMonth={this.loadItems.bind(this)}
              selected={moment().format("YYYY-MM-DD")}
              renderItem={this.renderItem.bind(this)}
              renderEmptyDate={()=>this.renderEmptyDate()}
              rowHasChanged={this.rowHasChanged.bind(this)}
              markingType={'custom'}
              markedDates={{
                /*
                '2019-03-28': {
                  customStyles: {
                    container: {
                      backgroundColor: 'green',
                    },
                    text: {
                      color: '#fff',
                      fontWeight: 'bold'
                    },
                  },
                },*/
                }}
              // monthFormat={'yyyy'}
              theme={theme}
              // renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
            />
            {this.Modal_ImageInfo()}
          </View>

      );
    }
    componentDidMount() {
      AsyncStorage.getItem('user_type', (err, user_type) => {
        this.setState({user_type});
        if(user_type !== '门店客服' && user_type !== '销售员') {
            AsyncStorage.getItem('barInfoArray',(err, barInfoArray) => {
                this.setState({barInfoArray: JSON.parse(barInfoArray),});
            });
        }
      });
    }
    async loadItems(day) {
      const date = day.dateString;
      
      const res = await Http.getFromAPI(Service.order,{
        filter: {
          created_time: date,
        },
        attributes: [ 
          'id', 'order_status', 'created_time','is_goodfeedback',
          'order_type', 'pay_method', 'is_arrived', 'consumption',
          'order_photo_id', 'package_id', 'bar_id',
          'is_self_come', 'reserve_time', 'is_reserve', 'arrived_time', 'contacted_time',
        ],
      });
      
      this.state.items[date] = res.status === 1 ? res.data : [];
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] =   this.state.items[key].sort((a, b) => a.bar_id - b.bar_id);
      });
      this.setState({items: newItems});
    }
    async GetImageInfo(photo_id) {
      const PhotoRes = await Http.get(Service.img, { id: photo_id });
      PhotoRes.status === 1 && ( this.setState({ uri: Service.host + PhotoRes.data.path, image_loading: true, Image_visible: true }) );
    }


    Modal_ImageInfo() {
      return(
          <Overlay
          isVisible={this.state.Image_visible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="transparent"
          width="auto"
          height="auto"
          onBackdropPress={() => this.setState({Image_visible: false})}
          >    
          <ImageBackground
              source={{
                  uri: this.state.uri,
              }}
              onLoad={()=>{this.setState({image_loading:false})}}
              style={{width:300,height:400,borderRadius:10}}
          >
              {
                  this.state.image_loading?
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                      <ActivityIndicator />
                  </View>
                  :
                  null
              }
              <TouchableOpacity onPress={()=>{this.setState({Image_visible: false})}} style={{position:'absolute'}}>
                  <Icon
                  name={'md-close'}
                  size={25}
                  color={'red'}
                  style={{
                      marginLeft:10,
                      marginTop:5,
                      position:'absolute',
                  }}
                  />
              </TouchableOpacity>
          
          </ImageBackground>
          </Overlay>
          )
    }
    renderItem(item) {
      const { user_type, barInfoArray } = this.state;
      const { is_goodfeedback, order_type, pay_method, is_arrived, bar_id } = item;
      const newItem = item;
      if(user_type === '区域经理') {
          newItem.user_type = user_type;
          newItem.bar_name = barInfoArray.filter(i => i.id === bar_id)[0].bar_name;
      }
      return (
        <AccountItem 
          item={newItem}
          onImgOpen={(id) => { this.GetImageInfo(id) }}
          onPress={(id) => { this.props.navigation.navigate('orderinfo',{ id }) }}
          tips={[
              is_arrived === '否' ? { tip: '客人未到', color: 'red' } : null,
              is_goodfeedback ? { 
                  tip:  is_goodfeedback === '是' ? '已好评' : '未好评', 
                  color: is_goodfeedback === '是' ? 'limegreen' : '#FF7744' 
              } : null,
              order_type ? { tip: order_type, color: 'deepskyblue' } : null,
              pay_method ? { tip: pay_method.replace('购买',''), color: '#00BBFF' } :null,
          ]} 
        />
      );
    }
  
    renderEmptyDate() {
      return (
        <View style={styles.emptyDate}><Text>今天没有订单</Text></View>
      );
    }
  
    rowHasChanged(r1, r2) {
      return r1.id !== r2.id;
    }
  
    timeToString(time) {
      const date = new Date(time);
      return date.toISOString().split('T')[0];
    }
  }
  
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F5F5F5',
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});