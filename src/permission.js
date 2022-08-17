// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式


const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

//路由的前置守卫
router.beforeEach(async(to, from, next) => {
    NProgress.start() // 开启进度条
        //先判断有无token  
    if (store.getters.token) {
        //有token   继续判断是不是去往登录页面  

        if (to.path === '/login') {
            //直接跳到主页
            next('/')

        } else {
            //判断有无 userInfo  没有的话需要获取用户的基本资料
            if (!store.getters.userId) {
                const roles = await store.dispatch('user/getUserInfo')


            }


            //放行
            next()

        }


    } else {
        // 如果没有token   判断去的是不是白名单里的路由
        if (whiteList.indexOf(to.path) > -1) {
            //放行
            next()

        } else {
            //强制去登录页面 登录
            next('/login')

        }

    }



    NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})



//后置守卫
router.afterEach(() => {
    NProgress.done() // 关闭进度条



})