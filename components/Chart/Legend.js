import React from 'react';
import {
    VictoryLegend,
  } from "victory-native";
import { random, range } from "lodash";
import { TouchableOpacity} from 'react-native';
import { Button} from 'react-native-elements';
export default class  extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
          
        };
        this.props.data= this.props.data===[]?[{x:'',y:1}]:this.props.data;
      }
    render()
    {
        return(
        
            <VictoryLegend 
                x={125} 
                y={50}
                title="Legend"
                gutter={20}
                style={{ title: {fontSize: 15,fontWeight: '200', } }}
                data={[
                    { name: "自来客", symbol: { fill: "tomato",} },
                    { name: "正价", symbol: { fill: "orange" } },
                    { name: "套餐", symbol: { fill: "gold" } }
                ]}
            />
            
          
        )
    }
}
