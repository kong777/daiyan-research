import React, { Component } from 'react'
import { getQuestionMenu, ISpeciality } from '../../api/question'
import { Menu, Drawer, Button } from 'antd';
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react';
import { AppStore } from '../../store';
import { SnippetsFilled, InteractionFilled } from '@ant-design/icons';
import './style.scss'
const { SubMenu } = Menu;

export interface IInjectProps {
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
                <Button size="large" type="primary" onClick={() => { this.injected.store.openMenu() }}>
                    <InteractionFilled style={{transform: 'scale(1.4)'}} />
                </Button>
                <Drawer
                    title="选择题库"
                    placement="left"
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
            </div>
        )
    }
}

export default AppMenu
