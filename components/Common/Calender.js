import React from 'react';
import {AsyncStorage,StyleSheet,View,ScrollView,Alert} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import Radio from '../../components/Form/Radio';
import { Size, ObjectClone } from '../../tools/Normal';
const theme = {
    backgroundColor: '#f5f5f5',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    // selectedDayBackgroundColor: 'blue',
    // selectedDayTextColor: '#fff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    arrowColor: 'orange',
    textMonthFontWeight: 'bold',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };
/*
<Calendar
onDateChange=(array)=>{}
/>
*/
export default class extends React.Component
{
    constructor(props)
    {
        super(props);
        this.Stack = [];
        this.state={
            mode: 'single',
            dateChoosed: [],
            currentYear: moment().year(),
            currentMonth: moment().month()+1,
            markedDates:{

            },
        }
    }
    componentDidMount() {
        console.log(this.state);
    }
    onDayPress(day) {
        if (this.state.mode === 'single') {
            const markedDates = ObjectClone(this.state.markedDates) ;
            let array = this.state.dateChoosed;
            if (!markedDates[day.dateString]) {
                markedDates[day.dateString] = {selected: true, color: 'deepskyblue', textColor: '#fff'};
                array.push(day.dateString);
                this.setState({dateChoosed:array, markedDates});
                // console.log(array);
            } else {
                delete markedDates[day.dateString];
                array = this.state.dateChoosed.filter(i => i!== day.dateString);
                this.setState({dateChoosed: array, markedDates});
            }
            this.props.onDateChange(array);
        } else if (this.state.mode === 'period') {
            const markedDates = ObjectClone(this.state.markedDates);
            const date = day.dateString;
            const Stack = this.Stack;
            if(Stack.length === 0) {
                markedDates[date] = {startingDay: true, color: 'orange', textColor: '#fff'};
                this.setState({markedDates})
                Stack.push(date);
            } else if(Stack.length === 1) {
                if (Stack[0] !== date) {
                    let range;
                    let start,end;
                    if(moment(date).isBefore(Stack[0])) {
                        range = moment.range(date, Stack[0]);
                        start = date;
                        end = Stack[0];
                    } else {
                        range = moment.range(Stack[0], date);
                        end = date;
                        start = Stack[0];
                    }
                    const newArr = Array.from(range.by('day')).map(m => m.format('YYYY-MM-DD'));
                    // console.log(newArr);
                    // console.log(start)
                    newArr.forEach(d => {
                        if (d === start) {
                            markedDates[d] = {startingDay: true, color: 'orange', textColor: '#fff'};
                        } else if (d === end) {
                            markedDates[d] = {endingDay: true, color: 'orange', textColor: '#fff'};
                        } else {
                            markedDates[d] = {selected: true, color: 'orange', textColor: '#fff'};
                        }
                    });
                    this.setState({dateChoosed: newArr, markedDates});
                    this.props.onDateChange(newArr);
                    Stack.push(date);
                }
            } else if(Stack.length === 2) {
                const markedDates = {};
                Stack.pop();
                Stack.pop();
                markedDates[date] = {startingDay: true, color: 'orange', textColor: '#fff'};
                this.setState({markedDates, dateChoosed: []})
                Stack.push(date);
            }
            
        }
    }

    render()
    {
        return (
            <View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',}}>
                <Radio
                buttons={['单选','连选']}
                selectedIndex={0}
                onOptionChange={(option)=>{
                    if (option === '单选') {
                        this.setState({ markedDates: {}, dateChoosed: [], mode: 'single' })
                    } else if(option === '连选') {
                        this.setState({ markedDates: {}, dateChoosed: [], mode: 'period'});
                    } else if(option === '自定义') {

                    }
                }}
                style={{height:30,width:100}}
                />
            </View>  
            <Calendar
                theme={theme}
                selected={[moment().format("YYYY-MM-DD")]}
                monthFormat={'yyyy-MM'}
                onMonthChange={(month) => {
                }}
                onDayPress={(day) => {
                   this.onDayPress(day);
                }}
                onDayLongPress={(day) => {
                    const date = day.dateString;
                }}
                markedDates={this.state.markedDates}
                markingType={this.state.mode === 'period' ? 'period' : undefined}
            />
            </View>
           )
        
    }

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
    }
})