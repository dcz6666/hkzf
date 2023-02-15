import { BrowserRouter, Routes,Route,NavLink, Navigate } from 'react-router-dom';
import { Button,TabBar } from 'antd-mobile-v5' // v5

//导入首页和城市选择两个组件
import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <div className="App">
      <NavLink to="home">Home</NavLink>
      <NavLink to="cityList">About</NavLink>

      <Routes>
        <Route path="/cityList" element={<CityList />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </div>
  );
}

export default App;
