import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import provinceMap from'../../utils/province-map'
import { getChinaJson, getProvinceJson } from '../../services/getData'

export default class Map extends Component {
    constructor(props){
        super(props)
        this.state={
            province: '',
            mapList: []
        }
    }
    async componentDidMount(){
        const{provinceName,mapList}=this.props
        const province = provinceName ? provinceMap[provinceName] : ''
        const chinaMapJson = await getChinaJson()
        echarts.registerMap('china',chinaMapJson.data)
        this.setState({
            province: province,
            mapList: mapList
        })
    }

    getOption=()=>{
      const{province,mapList}=this.state 
      const option={
          tooltip:{
              show:true,
              formatter:function (params) {
                  let tip=''
                  if (params.data) {
                      tip= params.name +
                      '：<br>确诊：' +
                      params.data['value'] +
                      '例<br>死亡：' +
                      params.data['deadCount'] +
                      '例<br>治愈：' +
                      params.data['curedCount'] +
                      '例'
                  }
                  return tip
              }
          },
          visualMap: {
            show: true,
            type: 'piecewise',
            min: 0,
            max: 2000,
            align: 'right',
            top: '2%',
            right: 0,
            left: 'center',
            inRange: {
              color: ['#ffc0b1', '#ff8c71', '#ef1717', '#9c0505']
            },
            pieces: [
              { min: 1000 },
              { min: 500, max: 999 },
              { min: 100, max: 499 },
              { min: 10, max: 99 },
              { min: 1, max: 9 }
            ],
            orient: 'horizontal',
            showLabel: true,
            padding: 5,
            text: ['高', '低'],
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 10
            }
          },
          series: [
            {
              type: 'map',
              name: '确诊人数',
              label: {
                show: true,
                position: 'inside',
                fontSize: 8,
                color:'black'
              },
              mapType: province ? province : 'china',
              data: mapList,
              roam: false,
              showLegendSymbol: false,
              rippleEffect: {
                show: true,
                brushType: 'stroke',
                scale: 2.5,
                period: 4
              }
            }
          ]
      } 
      return option
    }
    render() {
        return (
            <div>
                <ReactEcharts
                  option={this.getOption()}
                  notMerge={true}
                  lazyUpdate={true}
                  echarts={echarts}
                  style={{height:'400px',width:'100%'}}
                />
            </div>
        )
    }
}
