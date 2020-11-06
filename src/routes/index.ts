import { RouteProps } from 'react-router-dom'
import Menu from '../views/Menu'
import Footer from '../views/Footer'
import Home from '../views/Home'
import Queue from '../views/Queue'
import Random from '../views/Random'
import Login from '../views/Login'
import Logout from '../views/Logout'
import Exam from '../views/Exam'
import Review from '../views/Review'
import Diffcult from '../views/Diffcult'


export interface IRoute extends RouteProps {
  name?: string
  hide?: boolean
}

const routes: IRoute[] = [
  {hide: true, path: '*', component: Menu},
  {hide: true, path: '*', component: Footer},
  {hide: true, name: '菜单', path: '/', component: Home, exact: true},
  {name: '顺序做题', path: '/queue', component: Queue},
  {name: '随机做题', path: '/random', component: Random},
  {name: '错题回顾', path: '/review', component: Review},
  {name: '易错练习', path: '/diffcult', component: Diffcult},
  {name: '模拟考试', path: '/exam', component: Exam},
  {hide: true, name: '登录系统', path: '/login', component: Login},
  {name: '退出登录', path: '/Logout', component: Logout},
]

export default routes