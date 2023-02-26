import React from 'react'
import { NavBar } from 'antd-mobile'
// 导入 withRouter 高阶组件
import { withRouter } from 'react-router-dom'

// 导入 props 校验的包
import PropTypes from 'prop-types'


// 添加 className 和 rightContent（导航栏右侧内容） 属性
function NavHeader({
    children,
    history,
    onLeftClick,
    className,
    rightContent
}) {
    // 默认点击行为
    const defaultHandler = () => history.go(-1)
    return (
        <NavBar
            className={[styles.navBar, className || ''].join(' ')}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={onLeftClick || defaultHandler}
            rightContent={rightContent}
        >
            {children}
        </NavBar>
    )
}

