import axios from 'axios'
import firebase from "firebase"


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

}

const mutations = {

}

const actions = {

    //シェア
    async share({ rootState,dispatch },data){
        var shareData = {
            id:rootState.users.users[0].id,
            share_id:data.share_id
        }

        await axios.get('http://127.0.0.1:8000/api/share',{params:shareData}).then(async()=>{
            await dispatch('allReload',null,{root:true})

            //詳細モダールが開いている場合
            if(rootState.details.detailsList[0]){

                //詳細がユーザーの場合 投稿再取得
                if(rootState.details.detailsList[0].type ==="detailUser"){
                    dispatch('details/detailsUserAction', null ,{ root:true })
                //詳細が投稿の場合 投稿再取得
                }else{
                    dispatch('details/detailsPostAction', null ,{ root:true })
                }
            }
            
            //検索画面の場合、投稿再取得
            if(rootState.posts.searchList.search_post.length !== 0){
                dispatch('posts/searchListAction',null,{root:true})
            }
        }).catch(() =>{
            dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return
        })

        //シェアした投稿が自分の投稿でない場合、相手の通知に追加
        if(data.user_no !== shareData.id && data.share_flag === null){
            var uidData ={
                user_no:data.user_no
            }
            await axios.get('http://127.0.0.1:8000/api/get_uid',{params:uidData}).then(async(res)=>{
                await addNotificationData(shareData.id,'share',res.data[0].auth_id)
            }).catch(()=>{
                dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
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