import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间


//创建一个 axios实例
const service = axios.create({
        // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
        // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
        baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
        timeout: 50000 // 定义50秒超时
    }) // 创建一个axios的实例


//请求拦截器
service.interceptors.request.use((config) => {
    if (store.getters.token) {
        // 只有在有token的情况下 才有必要去检查时间戳是否超时
        if (IsCheckTimeOut()) {
            // 如果它为true表示 过期了
            // token没用了 因为超时了
            store.dispatch('user/logout') //登出
            router.push('/login')
            return Promise.reject(new Error('token失效了'))
        }



        config.headers['Authorization'] = `Bearer ${store.getters.token}`


    }

    return config
}, error => {
    return Promise.reject(error)
})

//响应拦截器
service.interceptors.response.use(response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    if (success) {
        return data
    } else {
        // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
        Message.error(message) // 提示错误消息
        return Promise.reject(new Error(message))
    }




}, error => {
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 当等于10002的时候 表示 后端告诉我token超时了
        store.dispatch('user/logout') // 登出action 删除token
        router.push('/login')
    } else {
        Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)


})


// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
    var currentTime = Date.now() //当前时间戳
    var timeStamp = getTimeStamp()

    return (currentTime - timeStamp) / 1000 > TimeOut

}


export default service