import React, { Component } from "react";
import { Skeleton, Divider } from "antd";
import styles from "./home.css";
import dayjs from "dayjs";
import { Tabs } from "antd-mobile";
import "antd-mobile/lib/tabs/style/css";
import {
  getVirusDataOnTime,
  getVirusDataStatic,
  getRumor,
  getTrend
} from "../../services/getData";
import Category from "../../components/category/category";
import Map from "./../../components/Map/map";
import { changeMapData } from "./../../utils/change";
export class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      newsList: [],
      caseList: [],
      virusDesc: {
        confirmedCount: 0,
        suspectedCount: 0,
        deadCount: 0,
        curedCount: 0,
        seriousCount: 0,
        modifyTime: 0,
        note1: "",
        note2: "",
        note3: "",
        remark1: "",
        remark2: "",
        confirmedIncr: 0,
        suspectedIncr: 0,
        deadIncr: 0,
        curedIncr: 0,
        seriousIncr: 0
      },
      staticList: [],
      mapList: [],
      rumorList: [],
      provinceName: "", //是否点击了某个省份
      tabIndex: 0,
      dateList: [],
      confirmedTrendList: [],
      suspectedTrendList: [],
      deadTrendList: [],
      curedTrendList: [],
      provinceList: [],
      loading: false,
      trendLoading: true
    };
  }
  componentDidMount() {
    this.initData();
    this.setState({
      timer: setInterval(() => {
        this.initData();
      }, 1000 * 60 * 20)
    });
  }
  componentWillUnmount() {
    const { timer } = this.state;
    clearInterval(timer);
    this.setState({ timer: null });
  }
  initData = async () => {
    const res = await getVirusDataOnTime();
    if (res.status === 200) {
      const { news, desc } = res.data.newslist[0];
      this.setState({
        newsList: news,
        virusDesc: desc,
        caseList: res.data.newslist[0].case
      });
    }
    const resuslt = await getVirusDataStatic();
    const { newslist } = resuslt.data;
    const maplist = changeMapData(newslist);
    let provinceArr = [];
    provinceArr.push("全国");
    maplist.forEach(item => {
      provinceArr.push(item.provinceShortName);
    });
    this.setState({
      staticList: newslist,
      mapList: maplist,
      provinceList: provinceArr,
      loading: false
    });
  };
  render() {
    const {
      virusDesc,
      mapList,
      provinceName,
      tabIndex,
      newsList,
      rumorList,
      dateList,
      confirmedTrendList,
      suspectedTrendList,
      deadTrendList,
      curedTrendList,
      provinceList,
      loading,
      trendLoading
    } = this.state;
    const tabs = [
      { title: "疫情地图" },
      { title: "最新消息" },
      { title: "疫情趋势" }
    ];
    const AllCategory = [
      {
        title: "确诊",
        count: virusDesc.confirmedCount,
        addcount: virusDesc.confirmedIncr,
        color: "#AA2200"
      },
      {
        title: "疑似",
        count: virusDesc.suspectedCount,
        addcount: virusDesc.suspectedIncr,
        color: "#dda451"
      },
      {
        title: "重症",
        count: virusDesc.seriousCount,
        addcount: virusDesc.seriousIncr,
        color: "#555555"
      },
      {
        title: "死亡",
        count: virusDesc.deadCount,
        addcount: virusDesc.deadIncr,
        color: "#000000"
      },
      {
        title: "治愈",
        count: virusDesc.curedCount,
        addcount: virusDesc.curedIncr,
        color: "#7ebe50"
      }
    ];
    return (
      <Skeleton loading={loading} active paragraph={{ rows: 50 }}>
        <div>
          <div className="header-top">
            <p className="header-title">新型冠状病毒肺炎疫情</p>
            <p className="header-tip">实时动态</p>
          </div>
          <Tabs
            tabs={tabs}
            initialPage={0}
            swipeable={false}
            tabBarInactiveTextColor="#616161"
            tabBarActiveTextColor="#6C63FF"
            tabBarUnderlineStyle={{ border: "1px #6C63FF solid" }}
          >
            <div className="Map">
              <div className="map-header">
                <div className="map-title">
                  <span>全国</span>
                  <p>
                    截至
                    {dayjs(virusDesc.modifyTime).format("YYYY年MM月DD日 HH:mm")}
                    (北京时间)
                  </p>
                </div>
                <div className="map-number">
                  {AllCategory.map((item, index) => (
                    <Category
                      key={index}
                      title={item.title}
                      count={item.count}
                      addcount={item.addcount}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
              <Divider />
              <div className='map-main' style={{width:'100%'}}>
              {mapList&&mapList.length>0?(  <Map provinceName={provinceName} mapList={mapList}/>):null}
              </div>
            </div>
            <div></div>
          </Tabs>
        </div>
      </Skeleton>
    );
  }
}

export default home;
