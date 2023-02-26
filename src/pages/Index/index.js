import React, { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
// 导入axios
import axios from 'axios'
// 导入
import { BASE_URL } from '../../utils/url'
// 导入样式文件
import './index.css'
// 导入utils中获取定位城市的方法
import { getCurrentCity } from '../../utils';


// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'

// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent/add'
  }
]

// H5获取地理位置信息
// navigator.geolocation.getCurrentPosition(position => {
//   console.log('当前位置信息：', position)
// })

export default class index extends Component {
  state = {
    swipers: [],
    isSwiperLoading: false,

    // 租房小组数据
    groups: [],
    // 最新资讯
    news: [],
    // 当前城市名称
    curCityName: '北京'
  }
  async componentDidMount() {
    this.getSwiper()
    this.getGroups()
    this.getNews()

    // 获取当前城市的方法
   const curCity = await getCurrentCity()
    this.setState({
      curCityName: curCity.label
    })
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

  // 获取租房小组数据的方法
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      groups: res.data.body
    })
  }

  // 获取最新资讯
  async getNews() {
    const res = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: res.data.body
    })
  }

  // 渲染导航菜单
  renderNavs() {
    return navs.map(item => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
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

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    let { isSwiperLoading } = this.state
    return (
      <div className="index">
        <div className="swiper">
          {isSwiperLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : ('')
          }
          {/* 搜索框 */}
          <SearchHeader cityName={this.state.curCityName} />
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>

          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img className="imgPic" src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>

      </div>
    )
  }
}
