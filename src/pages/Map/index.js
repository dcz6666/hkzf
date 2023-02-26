import React, { Component } from 'react'

// 导入封装好的 NavHeader 组件
// import NavHeader from '../../components/NavHeader'

// 导入样式
import styles from './index.module.css'
export default class index extends Component {
    componentDidMount(){
        //初始化地图实例
        const map = new window.BMap.Map('container');
        //设置中心点坐标
        const point = new window.BMap.Point(116.104,39.915);
        map.centerAndZoom(point,15)
    }
    render() {
        return (
            <div className={styles.map}>
              {/* 顶部导航栏组件 */}
              {/* <NavHeader>地图找房</NavHeader> */}
              {/* 地图容器元素 */}
              <div id="container" className={styles.container} />
      
            
            </div>
          )
    }
}
