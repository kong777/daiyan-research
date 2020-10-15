import { observable, computed, action } from 'mobx';
import { ILoginResult } from '../types/user'
import Cookies from 'js-cookie'

type size = 'small' | 'middle' | 'large'

export class AppStore {
    @observable isOpenMenu: boolean = false

    @action toggleMenuOpen () {
        this.isOpenMenu = !this.isOpenMenu
    }

    @action openMenu () {
        this.isOpenMenu = true
    }

    @action closeMenu () {
        this.isOpenMenu = false
    }

    @observable size: size = 'middle'

    @action setSize = (size: size) => {
        this.size = size
    }

    @observable user: ILoginResult = (Cookies.get('user') && JSON.parse(Cookies.get('user')!)) as ILoginResult  || {}

    @computed get getToken (): string | undefined {
        return this.user.token
    }

    @action setUser = (user: ILoginResult) => {
        this.user = user
        if (user.token) {
            Cookies.set('user', user)
        }
    }

    @action clearUser = () => {
        this.user = {}
        Cookies.remove('user')
    }

    @observable menuId: number = (Cookies.get('menuId') && +Cookies.get('menuId')!) || 1

    @computed get getMenuId (): number {
        return this.menuId
    }

    @action setMenuId = (menuId: number) => {
        this.menuId = menuId
        if (menuId) {
            Cookies.set('menuId', String(menuId))
        }
    }
}

export default new AppStore()