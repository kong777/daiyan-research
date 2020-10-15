import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import store from 'store/index'
import './style.scss'

const routes = [
    {
        link: '/queue',
        name: '顺序做题'
    },
    {
        link: '/random',
        name: '随机做题'
    },
    {
        link: '/exam',
        name: '模拟考试'
    },
    {
        link: '/review',
        name: '错题回顾'
    },
    {
        link: '/diffcult',
        name: '易错题'
    },
    {
        link: '/login',
        name: '自动登录'
    }
]

const Home: React.FC = () => {
    return <div className="index">
        <Row gutter={[8, 8]}>
            {routes.map((route) => <Col span={12}>
                <Button type="primary" block>
                    <Link to={route.link}>{route.name}</Link>
                </Button>
            </Col>)}
            <Col span={12}>
                <Button type="primary" block onClick={() => { store.openMenu() }}>
                    切换题库
                </Button>
            </Col>
        </Row>
    </div>
}

export default Home
