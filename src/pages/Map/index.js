import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
// 导入封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader'

// 导入样式
import styles from './index.module.css'

//解决脚手架全局变量
const BMap = window.BMap;
// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}
export default class index extends Component {
  state = {
    //小区下的房源列表
    housesList: [],
    //表示是否展示房源列表
    isShowList: false
  }
  componentDidMount() {
    this.initMap()
  }

  //初始化地图
  initMap() {
    //获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'));
    console.log("label,value", label, value);
    //初始化地图实例
    const map = new BMap.Map('container');
    //作用：能够在其他方法中通过 this来获取到地图
    this.map = map;
    //设置中心点坐标
    // const point = new window.BMap.Point(116.104,39.915);

    //创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    //将地址解析结果显示在地图上。并调整地图视野
    myGeo.getPoint(label, async (point) => {
      if (point) {
        //初始化地图
        map.centerAndZoom(point, 11)
        //添加常用空间
        // map.addOverlay(new BMap.Marker(point));
        map.addOverlay(new BMap.NavigationControl());
        map.addOverlay(new BMap.ScaleControl());

        //调用renderOverlays方法
        this.renderOverlays(value)

      }
    }, label)
    
    // 给地图绑定移动事件
    map.addEventListener("movestart",()=>{
      if(this.state.isShowList){
        this.setState({
          isShowList:false
        })
      }
    })
  }

  // 渲染覆盖物入口
  // 1 接受区域 id参数，获取该区域下的房源数据
  // 2 获取房源类型以及下级地图缩放级别
  async renderOverlays(id) {
    const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    const data = res.data.body;
    //调用getTypeAndZoom 方法获取级别好类型
    let { nextZoom, type } = this.getTypeAndZoom()
    console.log("nextZoom,type", nextZoom, type)
    data.forEach(item => {
      //创建覆盖物
      this.createOverlays(item, nextZoom, type)
    })
  }

  //计算要回执的覆盖物类型和下一个缩放级别
  // 区      -> 11，范围： >=10<12
  // 镇      -> 13，范围： >=12<14
  // 小区      ->15，范围： >=14<16
  getTypeAndZoom() {
    //调用地图的getZoom()方法，来获取当前缩放级别
    const zoom = this.map.getZoom();
    let nextZoom, type;
    console.log('当前地图缩放级别', zoom);
    if (zoom >= 10 && zoom < 12) {
      //区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制原型覆盖物（区、镇）
      type = "circle"
    } else if (zoom >= 12 && zoom < 14) {
      //镇
      nextZoom = 15
      type = "circle"
    } else if (zoom >= 14 && zoom < 16) {
      //小区
      type = 'rect'
    }
    return {
      nextZoom,
      type
    }
  }

  //创建覆盖物
  createOverlays(data, zoom, type) {
    let { coord: { longitude, latitude }, label: areaName, count, value } = data
    //创建坐标对象
    const areaPoint = new BMap.Point(longitude, latitude)
    if (type == 'circle') {
      //区或镇
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      //小区
      this.createRect(areaPoint, areaName, count, value)
    }
  }
  createCircle(point, name, count, id, zoom) {
    // 创建覆盖物
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-35, -35)
    })

    // 给label 对象添加一个唯一标识
    label.id = id
    //设置房源覆盖物内容
    label.setContent(`
     <div class="${styles.bubble}">
       <p class="${styles.name}">${name}</p>
       <p>${count}套</p>
     </div>
   `)

    //设置样式
    label.setStyle(labelStyle)

    // 添加点击事件
    label.addEventListener('click', () => {
      //调用renderOverLays 方法获取该区域下的房源数据
      this.renderOverlays(id);
      //清除覆盖物信息
      this.map.clearOverlays()
      //方法地图，以当前点击的覆盖物为中心放大地图
      this.map.centerAndZoom(point, zoom)
    })
    // 添加覆盖物到地图中
    this.map.addOverlay(label);
  }

  createRect(point, name, count, id) {
    // 创建覆盖物
    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(-50, -28)
    })

    // 给label 对象添加一个唯一标识
    label.id = id
    //设置房源覆盖物内容
    label.setContent(`
     <div class="${styles.rect}">
       <span class="${styles.housename}">${name}</span>
       <span class="${styles.housenum}">${count}套</span>
       <i class="${styles.arrow}"></i>
     </div>
   `)

    //设置样式
    label.setStyle(labelStyle)
    // 添加点击事件
    label.addEventListener('click', (e) => {

      //调用renderOverLays 方法获取该区域下的房源数据
      this.getHousesList(id)

      // 获取当前点击对象
      const target = e.changedTouches[0];
      let x= window.innerWidth/2-target.clientX;
      let y =(window.innerHeight-330)/2-target.clientY;
      this.map.panBy(x,y);
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label);
  }


  //获取小区房源信息
  async getHousesList(id) {
    const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`);
    console.log("房源", res)
    this.setState({
      housesList: res.data.body.list,
      // 展示房源列表
      isShowList: true
    })
  }

  // 封装渲染房屋列表的方法
  renderHousesList() {
    return this.state.housesList.map(item => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} alt="" />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {/* ['近地铁', '随时看房'] */}
            {item.tags.map((tag, index) => {
              const tagClass = 'tag' + (index + 1)
              return (
                <span
                  className={[styles.tag, styles[tagClass]].join(' ')}
                  key={tag}
                >
                  {tag}
                </span>
              )
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }
  render() {
    return (
      <div className={styles.map}>
        {/* 顶部导航栏组件 */}
        <NavHeader>地图找房</NavHeader>
        {/* 地图容器元素 */}
        <div id="container" className={styles.container} />
        {/* 房源列表 */}
        {/* 添加 styles.show 展示房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    )
  }
}
