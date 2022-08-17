 import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
 import { login, getUserInfo, getUserDetailById } from '@/api/user'



 const state = {
     token: getToken(),
     userInfo: {}
 }
 const mutations = {

     setToken(state, val) {
         state.token = val
         setToken(val)

     },

     removeToken() {
         state.token = null
         removeToken()
     },
     // 设置用户信息
     setUserInfo(state, userInfo) {
         state.userInfo = userInfo
     },
     // 删除用户信息
     reomveUserInfo(state) {
         state.userInfo = {}
     }



 }
 const actions = {
     //登录
     async login(context, data) {
         const result = await login(data)

         context.commit('setToken', result)

         setTimeStamp()

     },

     //获取用户基本资料
     async getUserInfo(context) {
         const result = await getUserInfo()
         const baseInfo = await getUserDetailById(result.userId)
         const baseResult = {...result, ...baseInfo }


         context.commit('setUserInfo', baseResult)
         return baseResult

     },

     // 登出的action
     logout(context) {

         // 删除token
         context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
             // 删除用户资料
         context.commit('reomveUserInfo') // 删除用户信息
     }





 }


 export default {
     namespaced: true,
     state,
     mutations,
     actions

 }