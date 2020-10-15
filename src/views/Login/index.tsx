import React, { useEffect, useState } from 'react'
import { autoLogin } from '../../api/user'
import { Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import qs from 'qs'
import './style.scss'

export interface ILoginProps {
}

const LoadingIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />

const LoginResult = <Result
    status="success"
    title="登录成功"
    subTitle="您已成功登录，正在自动跳转!"
/>

const Queue: React.FC<ILoginProps> = (props: ILoginProps) => {

    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        autoLogin().then(resp => {
            setIsLogin(true)
            const query = qs.parse(window.location.search.slice(1))
            const r = query.r || '/'
            setTimeout(() => {
                window.location.replace(r as string)
            }, 3000)
        }).catch(error => {
            console.error(error)
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="login">
            {isLogin ? LoginResult : LoadingIcon}
        </div>
    )
}

export default Queue