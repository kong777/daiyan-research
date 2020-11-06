import React, { useState } from 'react'
import { autoLogin } from '../../api/user'
import { Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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

    const [isLoging, setIsLoging] = useState(false)

    const clickHandle = () => {
        setIsLoging(true)
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
    }

    const LoginTip = <Result
        title="登录系统"
        subTitle="请点击下方按钮，通过测试账号登录"
        extra={
            <Button className="loginBtn" size="large" type="primary" onClick={clickHandle}>
                登录测试账号
            </Button>
        }
    />

    return (
        <div className="login">
            {isLoging && (isLogin ? LoginResult : LoadingIcon)}
            {!isLoging && LoginTip}
        </div>
    )
}

export default Queue