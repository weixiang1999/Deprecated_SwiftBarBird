import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import MenuView from '../../components/Common/MenuView';
import { Text } from 'react-native-elements';
import { Agenda, } from 'react-native-calendars';
import { Modal, Button } from '@ant-design/react-native';
import Form from '../../components/Form/Form';
import SquareItem from '../../components/List/SquareItem';
import ListByName from '../../components/List/ListByName';
import { Confirm, Tips, ClassifyByKey, Object2Array, ObjectClone } from '../../tools/Normal';

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
    title:'公告',
    headerRight:(<View/>)
  };
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      Add_visible: false,
      ChooseStore_visible: false,
      content: '',
      barInfoArray: [],
      bar_id: [],
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('user_type',(err,user_type) => {
      this.setState({ user_type });
      if(user_type === '区域经理') {
        AsyncStorage.getItem('barInfoArray', (err, barInfoArray) => {
          this.setState({ barInfoArray: JSON.parse(barInfoArray) });
        });
      }
    });
  }
  render() {
    return (
      <MenuView
      menu={
        [
          {
            title: '发布公告',
            visible: true,
            icon: 'md-chatboxes',
            color: '#FF8888',
            onPress: () => this.setState({Add_visible: true})
          },
        ]}
      >
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={moment().format("YYYY-MM-DD")}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={()=>this.renderEmptyDate()}
          rowHasChanged={this.rowHasChanged.bind(this)}
          markingType={'custom'}
          markedDates={{
          }}
          theme={theme}
        />
        {this.modal_addAnnouncement()}
      </MenuView>

    );
  }
  modal_addAnnouncement() {
    const FormConfig = [
      {
          type: 'Input',
          title: '公告内容',
          onValueChange: (text) => { 
            this.setState({ content: text });
          },
      },
      {
        type: 'CheckBox',
        title: '通知方式',
        visible: false,
        data: ['微信', '短信'],
        onValueChange: (value) => {
          console.log(value);
        }
      },
      {
        type: 'Radio',
        title: '可见人员',
        visible: this.state.user_type === '区域经理',
        style:{ width: 230 },
        content: ['销售员', '门店客服', '所有人'],
        onValueChange: (value) => {
          this.setState({visible_user_type: value});
        }
      },
      {
        type: 'CheckBox',
        title: '门店选择',
        visible: this.state.user_type === '区域经理',
        data: this.state.barInfoArray.map(i => {
          const newI = i;
          newI.label = newI.bar_name;
          return newI;
        }),
        onValueChange: (value) => {
          this.setState({ bar_id: value.map(i => i.id) });

        }
      },
    ];
    const Commit = async () => {
      if (this.state.content === '') {
        Tips('内容不能为空');
        return;
      }
      if (this.state.user_type === '区域经理') {
        if(! this.state.visible_user_type || this.state.bar_id.length === 0 ) {
          Tips('信息填写不完整');
          return;
        } else {
          const { visible_user_type, content, bar_id } = this.state;
          console.log(bar_id);
          await Promise.all(bar_id.map(async(id) => {
           
            const res = await Http.post(Service.announcement,{
              content,
              visible_user_type,
              bar_id: id,
            });
            console.log(res);
          }))
          /*
          Tips(res.message, () => { 
            this.setState({Add_visible: false}, () => { 
              this.loadItems({ dateString: moment().format('YYYY-MM-DD') }) 
            });
          });*/
        }
      } else {
        const res = await Http.post(Service.announcement,{
          content: this.state.content,
        });
        Tips(res.message, () => { 
          this.setState({Add_visible: false}, () => { 
            this.loadItems({ dateString: moment().format('YYYY-MM-DD') }) 
          });
        });
      }
     
    };
    return (
        <Modal
            title="发布公告"
            transparent
            onClose={()=>this.setState({Add_visible:false})}
            maskClosable
            visible={this.state.Add_visible}
            closable
            >
            <View style={{padding:5,marginTop:20,}}>
                
            <Form
            Form={FormConfig}
            />
            <Button 
            type='warning' 
            onPress={()=>{Confirm(Commit)}}
            >
            <Text>确认发布</Text>
            </Button>
            </View>
        </Modal>
    );


  }
  modal_chooseStore() {
    const FormConfig = [
      {
          type:'AreaPicker',
          title:'选择地区',
          onValueChange:async (text)=>{
              console.log(text);
              const res = await Http.get(Service.bar,{
                  province:text[0].label,
                  city: text[1].label,
                  attributes: [ 'id', 'bar_name'],
              });
              // console.log(res);
              this.setState({ barData: res.data.map(i => i.bar_name), barIdInfo: res.data });
          }
      },
      {
          type:'MuiltPicker',
          title:'选择酒吧',
          asyncData: 'barData',
          onValueChange:(text)=>{     
              const id = this.state.barIdInfo.filter(i => i.bar_name === text[0])[0].id;
              this.setState({bar_id:id});
          }
      }
    ]
    return (
        <Modal
          title="选择酒吧"
          transparent
          onClose={()=>this.setState({ChooseStore_visible: false})}
          maskClosable
          visible={this.state.ChooseStore_visible}
          closable
          >
          <View style={{padding:5,marginTop:20,}}>
          <Form
          Form={FormConfig}
          State={this.state}
          />
          <Button 
          type='warning' 
          onPress={()=>{this.setState({ChooseStore_visible: false})}}
          >
          <Text>确认选择</Text>
          </Button>
          </View>
        </Modal>
    );


  }
  
  async loadItems(day) {
    console.log(day);
    const date = day.dateString;
    const res = await Http.getFromAPI(Service.announcement,{
      filter: {
        created_time: date,
        visible_user_type: ['区域经理', '门店客服', '销售员' ,'所有人']
      },
      attributes: [ 
        'id', 'content', 'created_time', 'bar_id', 'visible_user_type',
      ],
    });
    this.state.items[date] = res.status === 1 ? res.data : [];
    const newItems = ObjectClone(this.state.items);
    this.setState({items: newItems});
  }

  renderItem(item) {
    const { user_type } = this.state;
    const bar_name = user_type === '区域经理' && this.state.barInfoArray.find(i => i.id === item.bar_id).bar_name;
    return (
      <SquareItem
      title={item.content}
      item={item}
      style={{height:70,marginTop:10, marginRight:10}}
      subtitle1={user_type === '区域经理' ? 
      `${bar_name}    ${item.visible_user_type}可见`
      :
      undefined
      }
      subtitle1Style={{  }}
      subtitle={`发布于${moment(item.created_time).format("HH:mm")}`}
      buttonList={[]}
      />
    )
   
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>今天没有公告</Text></View>
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
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  container:{
    flex:1,
    backgroundColor:'#F5F5F5',
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  },
});
