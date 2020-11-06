import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import store from 'store/index'
import './style.scss'
import routes from '../../routes/index'

const Home: React.FC = () => {
    return <div className="index">
        <Row gutter={[8, 8]}>
            {routes.filter(v => !v.hide && v.path).map((route) => <Col span={12}>
                <Button type="primary" block>
                    <Link to={route.path as string}>{route.name}</Link>
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
