import axios from 'axios'
import firebase from "firebase"
import router from '../../router' 

const state = {

    //ユーザーの状態
    //uid: null,
    userState: null,

    //user情報
    users:[],

    //firebase ログインエラー情報
    loginError:""

}

const mutations = {

    //ユーザー認証
    setUserState(state,data){
        state.userState = data
    },

    //ユーザー情報
    setUserInfo(state,data){
        state.users.splice(0,1,data[0])
    },

    //ログアウト時 各値リセット 
    deleteUserInfo(state){
        state.userState= null
        state.users = [{id: "prototype",user_id:"prototype",user_name:"prototype",self_introduction:"prototype",auth_id:"prototype",mode:"dark",color:"darkorange"}]
    },

    //ログイン時のエラーコード
    loginError(state,data){
        state.loginError = data
    }

}

const actions = {

    //firebase認証関連 ログイン
    async userLogin({ commit }, data) {
        const email = data.loginEmail
        const password = data.loginPassword

        await firebase.auth().signInWithEmailAndPassword(email, password).then(async() => {
            await commit('setUserState', 'login')
            commit('loginError','success')
        }).catch((error) =>{
            commit('loginError',error.code)
        })
    },

    //firebase認証関連 サインアップ
    async userSignup({ commit }, data) {
        commit('setUserState', 'signupFirebase')
        const email = data.signup.signupEmail
        const password = data.signup.signupPassword
        console.log(email)
        console.log(password)

        await firebase.auth().createUserWithEmailAndPassword(email, password).then(async() => {
            await commit('setUserState', 'signupFirebaseComplete')
        }).catch((error)=>{
            commit('loginError',error.code)
        })
    },

    //firebase認証関連 ログアウト
    async userLogout({ dispatch,commit }){
        commit('loginError','')
        await firebase.auth().signOut()
        await router.push('/LoginSignup')
        await dispatch('resetLogoutValue')

    },

    //ログアウト時 各値 リセット root系
    resetLogoutValue({ rootState }){
        rootState.loadingState = "standby"
        rootState.loadingNumber = 0
        rootState.currentPage ='timeline'
        rootState.profileCurrentTab = "post"
        rootState.loginSinupPageSelect = "initial"
        rootState.searchActiveTab = 'post'
        rootState.searchScreenValue = 'standby'
        rootState.searchWord = ''
        rootState.notificationActiveTab = 'reply'
        rootState.errorMessage = ''
        rootState.mode = [{
            type:'dark',
            name: 'ダーク',
            main_color: '#141414',
            sub_color: "#202020",
            text_color: "#ffffff",
            input_color: '#272727',
        }]
        rootState.color = [{
            type: 'darkorange',
            value: '#ff8c00',
        }]
        
        //posts
        rootState.posts.all_list = ""
        rootState.posts.my_list = ""
        rootState.posts.image_list = ""
        rootState.posts.post_count = ""
        rootState.replyedValue = []
        rootState.posts.searchList.search_post = []
        rootState.posts.searchList.search_user = []
        rootState.posts.notificationList.notification_reply = []
        rootState.posts.notificationCount = [],
        rootState.posts.timelineNotificationFlag = [],

        //favorite
        rootState.favorites.favorite_list = ""

        //follows
        rootState.follows.follows_info = ""

        //details
        rootState.details.detailsNumber = ['standby']
        rootState.details.detailsList = []
        rootState.details.closedScrollPosition = []

        //messages
        rootState.messages.message_list = '',
        rootState.messages.message_contents={
            user:[{
                user_id:'',
                user_name:'',
                userimage_url:'',
            }],
            message:[]
        }
        rootState.messages.message_count=[]
    },

    //firebase認証関連 ユーザーログイン判定
    setloginUser({ commit },val){
        commit('setUserState',val)
    },
    
    //ログアウト時 リセット
    deleteLoginUser({ commit }){
        commit('deleteUserInfo')
    },

    //mysql ユーザー情報登録
    async signupUserInfo({ commit,dispatch },data){
        await commit('setUserState', 'signupUserInfo')
        const user = firebase.auth().currentUser
        data.auth_id = user.uid 

        await axios.get('http://127.0.0.1:8000/api/user_signup',{ params: data}).then(async() =>{
            await commit('setUserState', 'signup')
        }).catch(()=>{
            dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
        })
    },
    

    //mysql ユーザー情報取得 
    async getUserInfo({ commit,dispatch },val){

        const user = firebase.auth().currentUser
        const authUid = {
            uid: user.uid
        }

        await axios.get('http://127.0.0.1:8000/api/user_info',{ params: authUid}).then(async (res) => {
            
            await commit('setUserInfo',res.data)
            }).catch(function(error){
                
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

    //mysql ユーザー情報変更
    async changeUserInfo({ rootState, dispatch }, data) {
        data.id = rootState.users.users[0].id
        data.imageName = data.imageUrl[0].name
        console.log(data)

        if(data.imageUrl !== rootState.users.users[0].userimage_url){

            const user = firebase.auth().currentUser.uid

            if(rootState.users.users[0].userimage_url !== null && rootState.users.users[0].userimage_name !== null){
                const deleteStorageRef = firebase.storage().ref('users/' + user + '/files/profile/' + rootState.users.users[0].userimage_name)
            
                deleteStorageRef.delete().catch(()=>{
                    dispatch('errorMessage','画像変更に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return
                })
            }

            
            const storageRef = firebase.storage().ref('users/' + user + '/files/profile/' + data.imageUrl[0].name)
            
            await storageRef.put(data.imageUrl[0]).then(async() =>{
                await firebase.storage().ref('users/' + user + '/files/profile/' + data.imageUrl[0].name).getDownloadURL().then(async(url) => {
                        
                        data.imageUrl = await url
                        
                        axios.get('http://127.0.0.1:8000/api/user_update',{ params: data}).then(async () =>{ 
                        await dispatch('getUserInfo')
                        dispatch('allReload',null,{root:true})

                    }).catch(() => {
                        dispatch('errorMessage','画像変更に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                        return
                    })
                }).catch(() =>{
                    dispatch('errorMessage','画像変更に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return
                })
            })

        }else{
            await axios.get('http://127.0.0.1:8000/api/user_update',{ params: data}).then(async () =>{ 
                    await dispatch('getUserInfo')
                    dispatch('allReload',null,{root:true})
                }).catch(()=>{ 
                    dispatch('errorMessage','変更に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return
                })
        }
    },

    async changeEmail({rootState,dispatch},newEmail){
        console.log(rootState.users.users[0].id)
        await firebase.auth().currentUser.updateEmail(newEmail).then(() => {
            alert('変更完了しました')
            return true
        }).catch(() => {
            dispatch('errorMessage','エラーが発生しました。申し訳ございませんが、もう一度お願いいたします。',{root:true})
            return
        })
    },
    
    async changePassword({rootState,dispatch},newPassword){
        console.log(rootState.users.users[0].id)
        await firebase.auth().currentUser.updatePassword(newPassword).then(() => {
            return true
        }).catch(() => {
            dispatch('errorMessage','エラーが発生しました。申し訳ございませんが、もう一度お願いいたします。',{root:true})
            return
        })
    },

    //ユーザー削除
    async deleteUser({rootState,dispatch}){
        var email = firebase.auth().currentUser.email
        var now = Date.now()
        var deleteEmail = 'delete' + now + email
        var data = {
            user_no:rootState.users.users[0].id
        }
        await firebase.auth().currentUser.updateEmail(deleteEmail).then(async() => {
            await axios.get('http://127.0.0.1:8000/api/delete_user',{ params: data }).then(async () =>{
                dispatch('userLogout')
            }).catch(() =>{
                dispatch('errorMessage','削除に失敗しました。申し訳ございませんが、もう一度お願いいたします。',{root:true})
                return
            })
        }).catch(()=>{
            dispatch('errorMessage','削除に失敗しました。申し訳ございませんが、もう一度お願いいたします。',{root:true})
            return
        })
    },
    
}

export default {
    //namespaced: true, // 追加
    state,
    mutations,
    actions,
}


