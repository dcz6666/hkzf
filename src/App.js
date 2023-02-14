import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Button } from 'antd-mobile-v5' // v5

//导入首页和城市选择两个组件
import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />}></Route>

        <Route path="/home" element={<Home />}></Route>

        <Route path="users">
          <Route path="xxx" element={<Demo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
