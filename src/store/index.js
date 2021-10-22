import { createStore } from 'vuex'
import users from './modules/users'
import posts from './modules/posts'
import favorites from './modules/favorite'
import follows from './modules/follows'
import details from './modules/details'
import messages from './modules/messages'
import shares from './modules/shares'
import axios from 'axios'
import router from '../router' 
import firebase from "firebase"

export default createStore({
  state: {
    loadingNumber: 0,

    loadingWord: 'Loading...',

    loadingState:'standby',

    currentPage: "timeline",
    
    currentTab: "all",

    profileCurrentTab: "post",

    loginSinupPageSelect: "initial",

    searchActiveTab: 'post',

    searchScreenValue: 'standby',

    searchWord: '',

    notificationActiveTab: 'reply',

    errorMessage: '',
    
    mode: [
      {
        type:'dark',
        name: 'ダーク',
        main_color: '#141414',
        sub_color: "#202020",
        text_color: "#ffffff",
        input_color: '#272727',
      }
    ],   

    color: [
      {
        type: 'darkorange',
        value: '#ff8c00',
      }
    ],
  },

  mutations: {

    changeLoginSignupPage(state,page){
      state.loginSinupPageSelect = page
    },

    changePage(state,activePage){
      state.currentPage = activePage
    },

    logoutPage(state){
      state.loginSinupPageSelect = "initial"
    },

    setMode(state,mode){
      state.mode = mode
    },

    setColor(state,color){
      state.color = color
    },

    tempMode(state,mode){
      state.mode.unshift(mode)
    },

    tempColor(state,color){
      state.color.unshift(color)
    },

    searchChangeTab(state,val){
      state.searchActiveTab = val
    },

    searchChangeScreen(state,val){
      state.searchScreenValue = val
    },

    setSearchWord(state,val){
      state.searchWord = val
    },

    resetSearchValue(state){
      state.searchActiveTab = 'post'
      state.searchScreenValue = 'standby'
      state.searchWord = ''
    },

    notificationChangeTab(state,val){
      state.notificationActiveTab = val
    },

    resetNotificationValue(state){
      state.notificationActiveTab = 'reply'
    },

    loadingValue(state, val){
      state.loadingState = val
    },

    loadingPercent(state,val){
      state.loadingNumber = val
    },

    loadingWord(state,val){
      state.loadingWord = val
    },

    errorMessage(state,val){
      state.errorMessage = val
    },

    resetErrorMessage(state){
      state.errorMessage = ''
    }

  },

  actions: {
    changeLoginSignupPage({ commit }, page){
      commit('changeLoginSignupPage', page)
    },

    changePage({ commit }, activePage){
      commit('changePage',activePage)
    },

    logoutPageSelect({ commit }){
      commit('logoutPage')
    },

    async tempModeChange({ commit,dispatch }, val){
      const mode = {
        type: val
      }

      await axios.get('http://127.0.0.1:8000/api/get_temp_mode',{ params: mode }).then((res) => {
        commit('tempMode',res.data[0])
      }).catch(() => {
        dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください')
        return
      })

    },

    async tempColorChange({ commit,dispatch }, val){

      const color = {
        type: val
      }

      await axios.get('http://127.0.0.1:8000/api/get_temp_color',{ params: color }).then((res) => {
        console.log(res.data)
        commit('tempColor',res.data[0])
      }).catch(() => {
        dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください')
        return
      })
      
    },

    //set mode 
    async setMode({ commit, dispatch },val){

      const uid = firebase.auth().currentUser.uid
      const mode = {
        uid:uid
      }

      await axios.get('http://127.0.0.1:8000/api/get_mode',{ params: mode }).then((res) => {
        commit('setMode',res.data)
        
      }).catch((error)=> {
        switch(error.response.status){
          case 500:
            if(val === 'login'){
              dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください')
              router.push('/')
            }else{
              dispatch('errorMessage','サーバーエラーが発生しました、上部リロードボタンを押すか、時間をおいてからもう一度ご利用ください')
            }
              break;
          default:
              console.log(error.response.status)
              break;
        }
      })
    },

    //set color
    async setColor({ commit ,dispatch },val){

      const uid = firebase.auth().currentUser.uid
      const color = {
        uid:uid
      }

      await axios.get('http://127.0.0.1:8000/api/get_color',{ params: color }).then((res) => {
        commit('setColor',res.data)
      }).catch((error) => {
        switch(error.response.status){
          case 500:
              if(val === 'login'){
                dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください')
                router.push('/')
              }else{
                dispatch('errorMessage','サーバーエラーが発生しました、上部リロードボタンを押すか、時間をおいてからもう一度ご利用ください')
              }
              break;
          default:
              console.log(error.response.status)
              break;
        }
      })
    },

    //change mode
    async changeMode({ rootState,dispatch },val){
      const mode = {
        id: rootState.users.users[0].id,
        type: val
      }

      await axios.get('http://127.0.0.1:8000/api/user_change_mode',{ params: mode}).then(async()=>{
        await dispatch('setMode')  
      }).catch(()=>{
        dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください')
        return
      })
    },

    //change color
    async changeColor({ rootState,dispatch },val){
      const color = {
        id: rootState.users.users[0].id,
        type: val
      }

      await axios.get('http://127.0.0.1:8000/api/user_change_color', { params: color}).then(async()=>{
        await dispatch('setColor')
      }).catch(()=>{
        dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください')
        return
      })
    },

    searchChangeTab({ commit },val){
      commit('searchChangeTab',val)
    },

    searchChangeScreen({ commit },val){
      commit('searchChangeScreen',val)
    },

    setSearchWord({ commit }, val){
      commit('setSearchWord',val)
    },

    resetSearchValue({ commit }){
      commit('resetSearchValue')
    },

    notificationChangeTab({ commit },val){
      commit('notificationChangeTab',val)
    },

    resetNotificationValue({ commit }){
      commit('resetNotificationValue')
    },

    loadingValue({ commit },val){
      commit('loadingValue',val)
    },

    loadingPercent({ commit },val){
      commit('loadingPercent',val)
    },

    loadingWord({ commit },val){
      commit('loadingWord',val)
    },

    errorMessage({ commit },val){
      commit('errorMessage',val)
    },

    resetErrorMessage({commit}){
      commit('resetErrorMessage')
    },

    async allReload({dispatch}){
      await dispatch('posts/allList',{ root: true })
      await dispatch('posts/myList',{ root: true })
      await dispatch('posts/medhiaList',{ root: true })
      await dispatch('favorites/favoriteList',{ root: true })
      await dispatch('posts/hotList',{ root: true })
    },
  }, 

  modules: {
    users,
    posts,
    favorites,
    follows,
    details,
    messages,
    shares,
  }
})
