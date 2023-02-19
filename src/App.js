import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

//导入首页和城市选择两个组件

//使用动态组件的方式导入
const Home = lazy(() => import('./pages/Home'));
const CityList = lazy(() => import('./pages/CityList'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div className='route-loading'>loading...</div>}>
        <div className='App'>
          <Switch>
            {/* 默认路由匹配时，跳转到 /home 实现路由重定向到首页 */}
            <Route path="/" exact render={()=><Redirect to="/home" />} />
            <Route path="/cityList" component={CityList}/>
            <Route path="/home" component={Home} />
          </Switch>
        </div>
      </Suspense>
    </Router>

  );
}

export default App;
