import React, {Component } from 'react'
import {  Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import './index.css'
import Index from '../Index'

// TabBar 数据
const tabItems = [
    {
        key: 'home',
        title: '首页',
        icon: 'icon-ind',
        path:"/home"
    },
    {
        key: 'todo',
        title: '找房',
        icon: 'icon-findHouse',
        path:"/home/list"
    },
    {
        key: 'message',
        title: '资讯',
        icon:  'icon-infom',
        path:"/home/news"
    },
    {
        key: 'personalCenter',
        title: '我的',
        icon: 'icon-my',
        path:"/home/profile"
    },
]
export default class index extends Component {
    state = {
        // 默认选中的TabBar菜单项
        selectedTab: this.props.location.pathname
      }

    // 组件接收到新的props（此处，实际上是路由信息）就会触发该钩子函数
    componentDidUpdate(prevProps){
        // prevProps 上一次的props，此处也就是上一次的路由信息
        // this.props 当前最新的props，此处也就是最新的路由信息
        // 注意：在该钩子函数中更新状态时，一定要在 条件判断 中进行，否则会造成递归更新的问题
        if (prevProps.location.pathname !== this.props.location.pathname) {
            // 此时，就说明路由发生切换了
            this.setState({
              selectedTab: this.props.location.pathname
            })
          }
    }
    // 渲染 TabBar
    renderTabBarItem(){
        return tabItems.map(item => (
            <TabBar.Item
               title={item.title}
                key={item.key}
                icon={<i className={`iconfont ${item.icon}`}></i>}
                selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                selected={this.state.selectedTab === item.path}
                onPress={()=>{
                    this.setState({
                        selectedTab:item.path
                    })
                    //路由切换
                    this.props.history.push(item.path)
                }}
            />
        ))
    }

    render() {
        return (
            <div className='home'>
                <Route exact path="/home" component={Index}/>

                <TabBar tintColor="#21b97a" noRenderContent={true} barTintColor="white">
                  {this.renderTabBarItem()}
                </TabBar>
            </div>
        )
    }
}
