import React, { useEffect } from 'react'
import { Result } from 'antd';
import './style.scss'
import store from '../../store';

export interface ILogoutProps {
}

const Queue: React.FC<ILogoutProps> = (props: ILogoutProps) => {

    useEffect(() => {
        store.clearUser()
        setTimeout(() => {
            window.location.replace('login')
        }, 3000)
        // eslint-disable-next-line
    }, [])

    return (
        <div className="logout">
            <Result
                status="success"
                title="登出成功"
                subTitle="您已成功登录，正在自动跳转!"
            />
        </div>
    )
}

export default Queue