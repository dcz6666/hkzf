import React, { Component } from 'react'
import {Toast } from 'antd-mobile'
import axios from 'axios'
import { List, AutoSizer } from 'react-virtualized';
// 导入封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader'
// 导入utils中获取定位城市的方法
import { getCurrentCity } from '../../utils';
import './index.css'

// 索引的（A，B）的高度
const TITLE_HEIGHT = 36
//每个城市名称的高度
const NAME_HEIGHT = 50
function formatCityIndex(letter) {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

//有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cityIndex: [],
            cityList: {},
            activeIndex: 0 //指定右侧字索引列表高亮的引号
        }
        //创建ref对象
        this.cityListComponent = React.createRef()
    }



    async componentDidMount() {
        await this.getCityList()
        //调用measureAllRows 提前计算List中每一行的高度 实现scrollToRow的精确跳转
        //注意：调用这个方法的时候需要保证List组件中已经有数据了！如果List组件中的数据为空 ，就会导致调用方法报错
        //解决：只要保证这个方法是后去到数据之后 调用的即可
        this.cityListComponent.current.measureAllRows()
    }

    // 数据格式化的方法
    // list:[{},{}]
    formatCityData = list => {
        const cityList = {}
        //1、遍历lists数据
        list.forEach(item => {
            let first = item.short.substr(0, 1);
            if (cityList[first]) {
                cityList[first].push(item);
            } else {
                cityList[first] = [item]
            }
        });
        //获取索引数据
        const cityIndex = Object.keys(cityList).sort();
        return {
            cityList,
            cityIndex
        }
    }

    //获取城市列表数据的方法
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        console.log("城市列表", res);
        const { cityList, cityIndex } = this.formatCityData(res.data.body);

        // 热门城市数据
        const hotRes = await axios.get("http://localhost:8080/area/hot")
        cityList['hot'] = hotRes.data.body;
        cityIndex.unshift('hot');

        // 获取当前定位城市
        const curCity = await getCurrentCity();
        /**
         * 1、将当前定位的城市数据添加到 cityList中
         * 2、将当前定位城市的索引添加到citycityIndex中
         */
        cityList['#'] = [curCity];
        cityIndex.unshift('#');
        this.setState({ cityList, cityIndex })
    }

    // 
    changeCity({ label, value }) {
        if (HOUSE_CITY.indexOf(label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
            this.props.history.go(-1)
        } else {
            Toast.info("该城市暂无房源数据", 1)
        }
    }

    // 创建动态计算每一行高度的方法
    getRowHeight = ({ index }) => {
        //索引标题高度 +城市数量 *城市名的高度
        let { cityList, cityIndex } = this.state;
        return TITLE_HEIGHT + NAME_HEIGHT * cityList[cityIndex[index]].length;
    }

    //封装渲染右侧索引列表的方法
    renderCityIndex() {
        //获取到cityIndex,并遍历其，实现渲染
        let { cityIndex, activeIndex } = this.state
        console.log("cityIndex====123", cityIndex);
        return cityIndex.map((item, index) => (
            <li className="city-index-item" key={item} onClick={() => {
                console.log("index", index);
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex == index ? 'index-active' : ''}>
                    {
                        item == 'hot' ? '热' : item.toUpperCase()
                    }
                </span>
            </li>
        ))
    }

    // 渲染每一行的
    rowRenderer = ({
        key, // key值
        index, // 索引值
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前在List 中是可见的
        style, // 注意：重点属性，一定给每一个行数据添加该样式！ 作用：指定每一行的位置
    }) => {
        const { cityIndex, cityList } = this.state;
        const letter = cityIndex[index];
        //获取指定字母索引下的城市列表数据
        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                {cityList[letter].map(item => (
                    <div
                        className="name"
                        key={item.value}
                        onClick={() => this.changeCity(item)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        );
    }
    onRowsRendered = ({ startIndex }) => {
        console.log("startIndex", startIndex);
        if (this.state.activeIndex != startIndex) {
            this.setState({ activeIndex: startIndex })
        }
    }



    render() {
        return (
            <div className="citylist">
                <NavHeader>城市选择</NavHeader>
                {/* c城市列表 */}
                <AutoSizer>
                    {
                        ({ width, height }) => <List
                            ref={this.cityListComponent}
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            scrollToAlignment="start"
                            onRowsRendered={this.onRowsRendered}
                        />
                    }
                </AutoSizer>

                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}
