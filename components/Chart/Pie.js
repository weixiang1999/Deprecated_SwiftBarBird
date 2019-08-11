import React from 'react';
import {
    VictoryPie,
  } from "victory-native";
import { random, range } from "lodash";
import { TouchableOpacity} from 'react-native';
import { Button} from 'react-native-elements';
export default class  extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
          randomData: this.generateRandomData(),
        };
        this.props.data= this.props.data===[]?[{x:'',y:1}]:this.props.data;
      }
    generateRandomData(points = 7) {
        this.setState({randomData:range(1, points + 1).map((i) => ({x: Math.ceil(i + random(-1, 2)), y: Math.floor(i + random(-1, 2))}))})
    }
    render()
    {
        return(
        
                <VictoryPie
                events={[{
                    target: "data",
                    eventHandlers: {
                      onClick: () => {
                        return [
                          {
                            target: "data",
                            mutation: (props) => {
                              const fill = props.style && props.style.fill;
                              return fill === "#c43a31" ? null : { style: { fill: "#c43a31" } };
                            }
                          }, {
                            target: "labels",
                            mutation: (props) => {
                              return props.text === "clicked" ? null : { text: "clicked" };
                            }
                          }
                        ];
                      }
                    }
                  }]}
                innerRadius={this.props.innerRadius||50}
                labelRadius={this.props.labelRadius||300}
                colorScale={["tomato", "orange", "gold", "cyan", "#FF8888",'deepskyblue','limegreen' ]}
                style={{ labels: { fontSize: 20,fontWeight:'200' }}}
                data={this.props.data}
                height={this.props.size||256}
                width={this.props.size||256}
                animate={{duration: 1500}}/>
            
          
        )
    }
}
