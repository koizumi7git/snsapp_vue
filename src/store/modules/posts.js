import axios from 'axios'
import firebase from "firebase"
import "firebase/database";

//時間表記変更 
function calculateTime(data){
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
    await db.ref('notification/'+ uid ).push({
        user:{
            No:userNo,
            type:typeValue
        }
    })
}

//投稿時 フォロワー通知
async function addPostNotification(followerData,myId){
    const db = firebase.database()
    console.log(followerData)

    for(var i = 0; i<followerData.length;i++){
        await db.ref('timeline/'+ followerData[i].auth_id ).push({
            user:{
                No:myId,
            }
        })
    }
}

const state = {

    //全ての投稿リスト
    all_list: "",

    //自分の投稿リスト
    my_list: "",

    //メディア投稿リスト
    medhia_list: "",
    
    //人気のある投稿リスト
    hot_list:"",
    
    //投稿数
    post_count: "",

    //リプライ時の投稿詳細
    replyedValue:[],

    //検索したワードの投稿・ユーザー
    searchList:{
        search_post:[],
        search_user:[],
    },

    //通知リスト 返信・他
    notificationList:{
        notification_reply:[],
        notification_other:[],
    },

    //クリックした画像・動画の情報
    viewMedhiaValue:[],

    //通知カウント
    notificationCount:[],

    //timelineページのリロードフラグ
    timelineNotificationFlag:[],
}

const mutations = {
    setAllList(state, data){
        state.all_list = data
    },

    setMylist(state, data){
        state.my_list = data
        state.post_count = data.length
    },

    setMedhialist(state,data){
        state.medhia_list = data
    },

    setHotList(state,data){
        state.hot_list = data
    },

    setReplyInfo(state,data){
        state.replyedValue.unshift(data)
    },

    resetReplyValue(state){
        state.replyedValue = []
    },

    setMedhiaInfo(state,data){
        state.viewMedhiaValue.unshift(data)
    },

    resetMedhiaValue(state){
        state.viewMedhiaValue = []
    },

    setSearchList(state,data){
        state.searchList = data
    },

    resetSearch(state){
        state.searchList.search_post = []
        state.searchList.search_user = []
    },

    setNotificationList(state,data){
        state.notificationList.notification_reply = data['notification_reply']
        state.notificationList.notification_other = data['notification_other']
    },

    setNotificationCount(state,data){
        state.notificationCount.unshift(data)
    },

    resetNotification(state){
        state.notificationCount = []
    },

    setTimelineGetFlag(state,data){
        state.timelineNotificationFlag.unshift(data)
    },

    resetTimelineGetFlag(state){
        state.timelineNotificationFlag = []
    }
    
}

const actions = {
    //全ての投稿リスト取得
    async allList({ commit, rootState, dispatch }) {
        var id = {
            id: rootState.users.users[0].id
        }
        await axios.get('http://127.0.0.1:8000/api/all_post',{ params:id }).then(async(res) => {
            await commit('setAllList', calculateTime(res.data))
        }).catch(()=>{ 
            dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return
        })
    },

    //自分の投稿リスト取得
    async myList({ commit, rootState , dispatch }){
        var id ={
            id: rootState.users.users[0].id
        }
        await axios.get('http://127.0.0.1:8000/api/my_post',{ params:id }).then(async(res) => {
            await commit('setMylist',calculateTime(res.data)) 
        }).catch(()=>{ 
            dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return
        })
    },

    //画像・動画投稿リスト取得
    async medhiaList({ commit ,rootState ,dispatch}){
        var id = {
            id: rootState.users.users[0].id
        }

        await axios.get('http://127.0.0.1:8000/api/medhia_post',{ params:id }).then(async(res) => {
            await commit('setMedhialist',calculateTime(res.data)) 
        }).catch(()=>{
            dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //人気のある投稿リスト取得
    async hotList({ commit, rootState,dispatch }){
        var id = {
            id: rootState.users.users[0].id
        }
        await axios.get('http://127.0.0.1:8000/api/hot_post',{ params:id }).then(async(res) => {
            await commit('setHotList',calculateTime(res.data))
        }).catch(()=>{
            dispatch('errorMessage','サーバーエラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //投稿
    async postData({ dispatch,rootState }, postData) {
        
        //投稿に画像・動画が含まれているか
        var length = postData.post_medhia.length

        //ユーザーのuid取得
        const user = firebase.auth().currentUser.uid

        //画像・動画を保存する場合にtokenとして日付取得
        const token = Date.now()

        //投稿時、画像・動画があるならfirestoreに保存、保存場所のURL取得
        async function setData(i){
            var fileName = postData.post_medhia[i].name
            
            var file = postData.post_medhia[i].data[0]

            var metadata = {
                contentType:postData.post_medhia[i].data[0].type
            }
        
            var refPath = 'users/' + user + '/files/post/' + token + '/' + fileName

            var storageRef = firebase.storage().ref(refPath)

            await storageRef.put(file,metadata).then(async() =>{
                await storageRef.getDownloadURL().then(async(url) => {
                    if(i === 0){
                        postData.first_medhia_url = await url
                        postData.first_medhia_name = fileName
                        postData.file_token = token
                    }else{
                        postData.second_medhia_url = await url
                        postData.second_medhia_name = fileName
                    }
                    
                }).catch(() => {
                    dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return 
                })
            }).catch(() => {
                dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

            //動画投稿の場合、サムネイル画像保存 URL取得
            if(postData.video_thumbnail !== ''){
                var thumbnailMetadata = {
                    contentType:'image/jpeg'
                } 

                var secondRefPath = 'users/' + user + '/files/post/' + token + '/thumbnail' + fileName
                
                var secondStorageRef = firebase.storage().ref(secondRefPath)

                await secondStorageRef.put(postData.video_thumbnail,thumbnailMetadata).then(async() =>{
                    await secondStorageRef.getDownloadURL().then(async(url) => {
                        postData.thumbnail_url = await url
                    }).catch(()=>{
                        dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                        return 
                    })
                }).catch(()=>{
                    dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return 
                })
            }

        }

        //投稿に画像・動画が含まれている場合
        if(length){
            
            for(var i = 0 ; i < length; i++ ){
                await setData(i)
            }

            delete postData.post_medhia
            delete postData.video_thumbnail

            await axios.get('http://127.0.0.1:8000/api/post_data',{ params:postData }).then(async() => {
                await dispatch('allReload',null,{root:true})
            }).catch(()=>{
                dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

        }else{

            postData.first_medhia_url = ""
            postData.second_medhia_url = ""
            postData.first_medhia_name = ""
            postData.second_medhia_name = ""
            postData.file_token = ""

            await axios.get('http://127.0.0.1:8000/api/post_data',{ params:postData }).then(async() => {
                await dispatch('allReload',null,{root:true})
            }).catch(()=>{
                dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })
            
        }

        var getUidData = {
            id:postData.post_id
        }
        
        //投稿時 フォロワーへの通知
        await axios.get('http://127.0.0.1:8000/api/get_follower_uid',{ params: getUidData}).then(async(res) => {
            console.log(res.data)
            await addPostNotification(res.data,rootState.users.users[0].user_id)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //返信
    async replyData({ rootState, dispatch },replyData){

        //返信時 画像・動画が含まれているか
        var length = replyData.reply_medhia.length

        //ユーザーのuid取得
        const user = firebase.auth().currentUser.uid

        //画像・動画を保存する場合にtokenとして日付取得
        const token = Date.now()

        replyData.user_id = rootState.users.users[0].id

        //画像・動画firebaseに保存、保存場所のURL取得
        async function setData(i){
            var fileName = replyData.reply_medhia[i].name
            
            var file = replyData.reply_medhia[i].data[0]

            var metadata = {
                contentType:replyData.reply_medhia[i].data[0].type
            }
        
            var refPath = 'users/' + user + '/files/post/' + token + '/' + fileName

            var storageRef = firebase.storage().ref(refPath)

            await storageRef.put(file,metadata).then(async() =>{
                await firebase.storage().ref(refPath).getDownloadURL().then(async(url) => {
                    if(i === 0){
                        replyData.first_medhia_url = await url
                        replyData.first_medhia_name = fileName
                        replyData.file_token = token
                    }else{
                        replyData.second_medhia_url = await url
                        replyData.second_medhia_name = fileName
                    }
                    
                }).catch(()=>{
                    dispatch('errorMessage','返信に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return 
                })
            }).catch(()=>{
                dispatch('errorMessage','返信に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

            //動画が含まれている場合、サムネイル画像保存、保存場所のURL取得
            if(replyData.video_thumbnail !== ''){
                var thumbnailMetadata = {
                    contentType:'image/jpeg'
                } 

                var secondRefPath = 'users/' + user + '/files/post/' + token + '/thumbnail' + fileName
                
                var secondStorageRef = firebase.storage().ref(secondRefPath)

                await secondStorageRef.put(replyData.video_thumbnail,thumbnailMetadata).then(async() =>{
                    await secondStorageRef.getDownloadURL().then(async(url) => {
                        replyData.thumbnail_url = await url
                    }).catch(()=>{
                        dispatch('errorMessage','返信に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                        return 
                    })
                }).catch(()=>{
                    dispatch('errorMessage','返信に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return 
                })
            }

        }

        //返信に画像・動画が含まれている場合
        if(length){
            for(var i = 0 ; i < length; i++ ){
                await setData(i)
            }

            delete replyData.reply_medhia
            delete replyData.video_thumbnail
            await axios.get('http://127.0.0.1:8000/api/reply',{params:replyData}).then(async()=>{
                await dispatch('allReload',null,{root:true})
            }).catch(()=>{
                dispatch('errorMessage','返信に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

        }else{
            await axios.get('http://127.0.0.1:8000/api/reply',{params:replyData}).then(async()=>{
                await dispatch('allReload',null,{root:true})
            }).catch(()=>{
                dispatch('errorMessage','返信に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })
        }

        //詳細モーダルでの返信、投稿・ユーザー情報再取得
        if(rootState.details.detailsList[0]){
            if(rootState.details.detailsList[0].type ==="detailUser"){
                dispatch('details/detailsUserAction', null ,{ root:true })
            } else{
                dispatch('details/detailsPostAction', null ,{ root:true })
            }
        }
        
        //検索ページでの返信、投稿・ユーザー情報再取得
        if(rootState.posts.searchList.search_post.length !== 0){
            dispatch('searchListAction')
        }

        //返信先が自分ではない場合、該当ユーザーに通知
        if(replyData.post_user_no !== replyData.user_id){
            var uidData ={
                user_no:replyData.post_user_no
            }
            console.log(uidData)
            await axios.get('http://127.0.0.1:8000/api/get_uid',{params:uidData}).then(async(res)=>{
                await addNotificationData(replyData.user_id,'reply',res.data[0].auth_id)
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })
        }

    },

    //リプライする投稿の情報をセット
    setReplyInfo({ commit },data){
        commit('setReplyInfo',data)
    },

    //リプライした投稿の情報をリセット
    resetReplyValue({ commit }){
        commit('resetReplyValue')
    },

    //クリックした画像・動画の情報セット
    setMedhiaInfo({ commit },data){
        commit('setMedhiaInfo',data)
    },

    //画像・動画モーダルの情報リセット
    resetMedhiaValue({ commit }){
        commit('resetMedhiaValue')
    },

    //検索ワードのリスト取得
    async getSearchList({ commit,dispatch,rootState },data,){
        data.id = rootState.users.users[0].id
        await axios.get('http://127.0.0.1:8000/api/search_list',{params: data}).then(async(res)=>{
            
            var searchList = calculateTime(res.data['search_post'])
            res.data['search_post'] = searchList

            await commit('setSearchList',res.data)
            dispatch('searchChangeScreen',data.value,{ root:true });
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //検索リストでのそれぞれのアクション時、検索リストを再取得
    async searchListAction({ commit ,rootState,dispatch }){
        var data = {
            searchWord: "%" + rootState.searchWord + "%",
            id: rootState.users.users[0].id
        }
        await axios.get('http://127.0.0.1:8000/api/search_list',{params: data}).then(async(res)=>{

            var searchList = calculateTime(res.data['search_post'])
            res.data['search_post'] = searchList

            await commit('setSearchList',res.data)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //検索リストリセット
    resetSearch({ commit, dispatch }){
        dispatch('resetSearchValue',null,{ root:true })
        commit('resetSearch')
    },

    //通知リスト取得
    async notificationList({ commit, rootState, dispatch }){
        var data = {
            id: rootState.users.users[0].id
        }
        await axios.get('http://127.0.0.1:8000/api/notification_list',{ params: data}).then(async(res) =>{
            var replyList = calculateTime(res.data['notification_reply'])
            res.data['notification_reply'] = replyList

            var otherList = calculateTime(res.data['notification_other'])
            res.data['notification_other'] = otherList

            await commit('setNotificationList',res.data)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //通知数のためのデータ格納
    notificationCount({commit},data){
        commit('setNotificationCount',data)
    },

    //通知リストリセット
    resetNotification({ commit })
    {
        commit('resetNotification')
    },

    //タイムラインのリロードフラグセット
    timelineGetFlag({commit},data)
    { 
        commit('setTimelineGetFlag',data)
    },

    //タイムラインのリロードフラグリセット
    resetTimelineGetFlag({commit})
    {
        commit('resetTimelineGetFlag')
    },

    //投稿を削除
    async deletePost({rootState},data){
        data.id = rootState.users.users[0].id
        await axios.get('http://127.0.0.1:8000/api/delete_post',{params: data}).catch((error) => {
            console.log(error)
        })
    },
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
}