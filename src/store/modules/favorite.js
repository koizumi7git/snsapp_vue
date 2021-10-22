import axios from "axios"
import firebase from "firebase"

function calculateTime(data){
    //時間表記変更
    var now = Date.now()
    var i = 0

    for(i; i < data.length; i++){
        var changeTime = new Date (Date.parse(data[i]['created_at']))
        var differenceTime = now - changeTime

        var days = Math.floor(differenceTime/1000/60/60/24)

        if(days>6){
            data[i]['created_at'] = changeTime.toLocaleDateString('ja')
            continue;
        }else if(days>0){
            data[i]['created_at'] = days + '日前'
            continue;
        }

        var hours = Math.floor(differenceTime/1000/60/60)%24

        if(hours > 0){
            data[i]['created_at'] = hours + '時間前'
            continue;
        }

        var min = Math.floor(differenceTime/1000/60)%60

        if(min > 0){
            data[i]['created_at'] = min + '分前'
            continue;
        }

        var sec = Math.floor(differenceTime/1000)%60

        data[i]['created_at'] = sec + '秒前'
    }

    return data

}

//リアルタイム通知 登録
async function addNotificationData(userNo,typeValue,uid){
    const db = firebase.database()
    db.ref('notification/'+ uid ).push({
        user:{
            No:userNo,
            type:typeValue
        }
    })
}

const state = {
    //お気に入りリスト
    favorite_list: "",
}

const mutations = {

    setFavoriteList(state, data){        
        state.favorite_list = data
    }

}

const actions = {

    //お気に入りリスト取得
    async favoriteList({ commit , rootState, dispatch}){
        var fav_data = {
            user_id: rootState.users.users[0].id,
        }
        await axios.get('http://127.0.0.1:8000/api/favorite_list',{ params: fav_data}).then(async(res) => {
            await commit('setFavoriteList',calculateTime(res.data))
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },
    
    //お気に入り
    async favorite({ rootState, dispatch},data){
        var fav_data = {
            user_id: rootState.users.users[0].id,
            post_id: data.post_id
        }
        await axios.get('http://127.0.0.1:8000/api/favorite',{ params:fav_data }).catch(function(error){ console.log(error) })
        await dispatch('allReload',null,{root:true})

        //投稿詳細モーダル時でのお気に入り リスト更新
        if(rootState.details.detailsList[0]){
            if(rootState.details.detailsList[0].type ==="detailUser"){
                dispatch('details/detailsUserAction', null ,{ root:true })
            }else{
                dispatch('details/detailsPostAction', null ,{ root:true })
            }
        }

        //検索ページでのお気に入り リスト更新
        if(rootState.posts.searchList.search_post.length !== 0){
            dispatch('posts/searchListAction',null,{root:true})
        }
        
        //通知ページでのお気に入り リスト更新
        if(rootState.currentPage === 'notification'){
            dispatch('posts/notificationList',null,{root:true})
        }

        //お気に入りが自分の投稿出ない場合かつお気に入りする場合(解除は無し) 該当ユーザーに通知
        if(data.user_no !== fav_data.user_id && data.fav_flag === null){
            var uidData ={
                user_no:data.user_no
            }
            await axios.get('http://127.0.0.1:8000/api/get_uid',{params:uidData}).then(async(res)=>{
                await addNotificationData(fav_data.user_id,'favorite',res.data[0].auth_id)
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })
        }

    }


}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}