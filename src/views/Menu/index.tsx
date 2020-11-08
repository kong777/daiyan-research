import React, { Component } from 'react'
import { getQuestionMenu, ISpeciality } from '../../api/question'
import { Menu, Drawer, Button } from 'antd';
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react';
import { AppStore } from '../../store';
import { SnippetsFilled, InteractionFilled, LeftOutlined } from '@ant-design/icons';
import './style.scss'
import routes from '../../routes/index'
import { RouteComponentProps } from 'react-router-dom';
const { SubMenu } = Menu;

export interface IInjectProps extends RouteComponentProps {
    store: AppStore
}

export interface IMenuProps {
}

export interface IMenuState {
    menu: ISpeciality[];
}

@inject('store')
@observer
class AppMenu extends Component<IMenuProps, IMenuState> {
    constructor(props: IMenuProps) {
        super(props)
        this.state = {
            menu: []
        }
        this.onClose = this.onClose.bind(this)
    }

    get injected () {
        return this.props as IInjectProps
    }

    componentWillMount() {
        getQuestionMenu().then(result => {
            this.setState({ menu: result.data.list[0].speciality })
        })
    }

    @computed get getCurrentQuestionMenuName() {
        const result = this.injected.store.menuId && this.state.menu.find(v => v.id === this.injected.store.menuId)?.name
        return result
    }

    onClose () {
        this.injected.store.closeMenu()
    }

    render() {
        return (
            <div className="d-menu">
                <div className="d-menu-left">
                    {this.injected.location.pathname !== '/' && this.injected.location.pathname !== '/login' && <Button size="large" type="primary" onClick={() => { this.injected.history.goBack() }}>
                        <LeftOutlined style={{transform: 'scale(1.4)'}} />
                    </Button>}
                </div>
                <p className="d-route-name">{routes.find(v => this.injected.location.pathname === v.path)?.name}</p>
                <Drawer
                    title="选择题库"
                    placement="right"
                    closable={true}
                    onClose={this.onClose}
                    visible={this.injected.store.isOpenMenu}
                    className={"d-drawer"}
                >
                    <Menu
                        defaultSelectedKeys={[String(this.injected.store.menuId)]}
                        defaultOpenKeys={['menu']}
                        mode="inline"
                    >
                        <SubMenu key="menu" icon={<SnippetsFilled />} title={this.getCurrentQuestionMenuName}>
                            {this.state.menu.map(v => {
                                return (
                                    <Menu.Item key={v.id} onClick={() => { this.injected.store.setMenuId(v.id) }}>
                                        {v.name}
                                    </Menu.Item>
                                )
                            })}
                        </SubMenu>
                    </Menu>
                </Drawer>
                <div className="d-menu-right">
                    {this.injected.store.user?.token &&
                    this.injected.location.pathname !== '/login' &&
                    this.injected.location.pathname !== '/exam' &&
                    this.injected.location.pathname !== '/logout' &&
                    <Button className="exchange" size="large" type="primary" onClick={() => { this.injected.store.openMenu() }}>
                        <InteractionFilled style={{transform: 'scale(1.4)'}} />
                    </Button>}
                </div>
            </div>
        )
    }
}

export default AppMenu
