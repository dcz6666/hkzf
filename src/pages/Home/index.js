import React, { lazy, Component } from 'react'
import { Badge, TabBar } from 'antd-mobile-v5' // v5
import { AppOutline ,UnorderedListOutline,MessageOutline,UserOutline} from 'antd-mobile-icons'
import './index.css'
// TabBar 数据
const tabItems = [
    {
        key: 'home',
        title: '首页',
        icon: <AppOutline />,
        path:"/home"

    },
    {
        key: 'todo',
        title: '找房',
        icon: <UnorderedListOutline />,
        path:"/home/list"
    },
    {
        key: 'message',
        title: '咨询',
        icon:  <MessageOutline />,
        path:"/home/news"
    },
    {
        key: 'personalCenter',
        title: '我的',
        icon: <UserOutline />,
        path:"/home/profile"
    },
]
export default class index extends Component {
    // 渲染 TabBar
    renderTabBarItem(){
        return tabItems.map(item => (
            <TabBar.Item
                key={item.key}
                icon={ item.icon}
                title={item.title}
            />
        ))
    }

    render() {
        return (
            <div>
                <TabBar>
                  {this.renderTabBarItem()}
                </TabBar>
            </div>
        )
    }
}
