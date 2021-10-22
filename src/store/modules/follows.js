import axios from "axios"


const state = {

    //フォロー・フォロワーリスト
    follows_info: ""

}

const mutations = {

    followsInfoSet(state, data){
        state.follows_info = data
    }

}

const actions = {

    //アカウント作成時 フォロー登録
    async signupFollow({ rootState, dispatch}){

        var data = {
            id: rootState.users.users[0].id,
        }

        await axios.get('http://127.0.0.1:8000/api/signup_follow',{params: data}).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //フォロー・フォロワーリスト取得
    async followInfo({ commit ,rootState, dispatch }){
        var data = {
            id : rootState.users.users[0].id,
        }
        
        await axios.get('http://127.0.0.1:8000/api/follow_info',{ params: data}).then(async(res) => {

            await commit('followsInfoSet',res.data)
            
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //フォロー解除
    async removeFollow({ rootState, dispatch }, data){
        var followData = {
            myId: rootState.users.users[0].id,
            id: data.id
        }

        await axios.get('http://127.0.0.1:8000/api/remove_follow',{params: followData}).then(async() =>{

            await dispatch('followInfo')
            //詳細モーダル時にフォロー、リストを再取得
            if(rootState.details.detailsList.length !== 0){
                if(data.type === "detailsUsers"){
                    dispatch('details/followFlag', followData, { root:true })
                }else if(data.type === "detailsFollows"){
                    dispatch('details/detailsFollowAction', null ,{ root:true })
                }
            }

            //サーチリストからのフォロー解除時
            if(rootState.posts.searchList.search_user.length !== 0){
                dispatch('posts/searchListAction',null,{ root:true})
            }

            await dispatch('allReload',null,{root:true})

        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //フォロー
    async addFollow({ rootState, dispatch }, data){
        var followData = {
            myId: rootState.users.users[0].id,
            id: data.id
        }

        await axios.get('http://127.0.0.1:8000/api/add_follow',{params: followData}).then(async() =>{

            await dispatch('followInfo')
            //詳細モーダル時にフォロー、リストを再取得
            if(rootState.details.detailsList.length !== 0){
                dispatch('details/followFlag', followData, { root:true })
                dispatch('details/detailsFollowAction', null ,{ root:true })
            }
            
            //サーチリストからのフォロー解除時
            if(rootState.posts.searchList.search_user.length !== 0){
                dispatch('posts/searchListAction',null,{ root:true})
            }

            await dispatch('allReload',null,{root:true})

        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}