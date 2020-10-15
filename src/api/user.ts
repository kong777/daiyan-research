import service from './'
import { AxiosPromise } from 'axios'
import { ILoginInput, ILoginResult } from '../types/user'
import store from '../store'

const login = (data: ILoginInput):AxiosPromise<ILoginResult> => {
    return service({
        url: '/login/login',
        method: 'post',
        data
    })
}

const autoLogin = async () => {
    try {
        const result = await login({username: 'test', password: 'test'})
        store.setUser(result.data)
    } catch (e) {
        console.error('自动登录失败')
        console.error(e)
    }
}

export {
    login,
    autoLogin
}