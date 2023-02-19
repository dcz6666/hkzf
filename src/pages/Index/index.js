import React, { Component } from 'react'
import { Carousel } from 'antd-mobile'
// 导入axios
import axios from 'axios'
// 导入
// import { BASE_URL } from '../../utils/url'
let BASE_URL="http://localhost:8080"


export default class index extends Component {
  state = {
    swipers: [],
    isSwiperLoading: false,
  }
  componentDidMount() {
    this.getSwiper()
  }

  //获取轮播图数据的方法
  async getSwiper() {
    let res = await axios.get("http://localhost:8080/home/swiper");
    console.log("res", res);
    this.setState({
      swipers: res.data.body,
      isSwiperLoading: true
    })
  }

  //渲染轮播图结构
  renderSwipers() {
    let { swipers } = this.state;
    return swipers.map(item => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{ display: 'inline-block', width: '100%', height: 212 }}
      >
        <img src={BASE_URL + item.imgSrc}
          style={{ width: '100%', verticalAlign: 'top' }} />
      </a>
    ))
  }

  render() {
    return (
      <div>
        <Carousel>
          {this.renderSwipers()}
        </Carousel>

      </div>
    )
  }
}
