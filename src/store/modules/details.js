import axios from "axios"

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

const state = {

    detailsNumber:['standby'],

    //詳細モーダルに関するリスト取得
    detailsList:[],
    
    //ページの現在のスクロール位置
    keepScrollPosition:[],

    //前回のスクロール位置を保存 詳細モーダルを閉じるときに戻る
    closedScrollPosition:[],
}

const mutations = {
    //詳細モーダル表示するために、データ格納
    changemodal(state,data){
        if(data.type === 'detailPost'){
            state.detailsNumber.unshift(data.postDetails.post_details[0].post_id)
        }else{
            state.detailsNumber.unshift('standby')
        }
        state.detailsList.shift()
        state.detailsList.unshift(data)
    },

    scroll(state,data){
        state.keepScrollPosition = data
    },

    setScrollPosition(state){
        state.closedScrollPosition.unshift(state.keepScrollPosition)
    },

    close(state){
        state.detailsNumber.shift()
        state.detailsList.shift()
    },

    resetClose(state){
        state.detailsNumber = ['standby']
        state.detailsList = []
        state.closedScrollPosition = []
    },

    scrolldelete(state){
        state.closedScrollPosition.shift()
    },

    setTemp(state,test){
        state.detailsList.unshift(test)
    },

    followFlagChange(state,data){
        state.detailsList[0].followFlag = data 
    },

    detailsUserAction(state,data){
        state.detailsList[0].postCount = data.postCount
        state.detailsList[0].userPost = data.userPost
    },

    detailsPostAction(state,data){
        state.detailsList[0].postDetails.post_details[0].reply_count = data.post_details[0].reply_count
        state.detailsList[0].postDetails.post_details[0].reply_flag = data.post_details[0].reply_flag
        state.detailsList[0].postDetails.post_details[0].favorite_count = data.post_details[0].favorite_count
        state.detailsList[0].postDetails.post_details[0].fav_flag = data.post_details[0].fav_flag
        state.detailsList[0].postDetails.post_details[0].share_count= data.post_details[0].share_count
        state.detailsList[0].postDetails.post_details[0].share_flag = data.post_details[0].share_flag
        state.detailsList[0].postDetails.reply_details = data.reply_details
    },

    detailsFollowAction(state,data){
        state.detailsList[0].userFollowInfo = data
    }
}

const actions = {

    //詳細モーダル表示
    async changemodal({commit, rootState, dispatch},data){
        const test = {
            type: 'temporary'
        }
        commit('setTemp',test)
        
        //詳細がユーザーの場合
        if(data.type === "detailUser"){
            //details userinfo

            const modalData ={
                type: data.type,
                userInfo:'',
                userPost:'',
                postCount:'',
                userFollowInfo:'',
                followFlag:'',
            }

            //userInfo取得する変数
            const userData ={
                userId: data.id
            }

            //postData folloData取得する変数
            const userId = {
                id: data.userNo,
                myNo: rootState.users.users[0].id
            }

            //api 
            //該当ユーザーの情報 取得
            await axios.get('http://127.0.0.1:8000/api/get_user_details',{params: userData}).then(async(res) => {
                //console.log(res.data)
                modalData.userInfo = await res.data
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

            //該当ユーザーの投稿リスト 取得
            await axios.get('http://127.0.0.1:8000/api/get_user_post_details',{params: userId}).then(async(res) =>{

                var data = await calculateTime(res.data)
                modalData.postCount = data.length
                modalData.userPost = data
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

            //該当ユーザーのフォロー情報 取得
            console.log(userId)
            await axios.get('http://127.0.0.1:8000/api/follow_info_details',{params: userId}).then(async(res) => {
                
                modalData.userFollowInfo = await res.data
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

            
            const followData ={
                followingId: rootState.users.users[0].id,
                followedId: modalData.userInfo[0].id
            }

            //該当ユーザーに対する自分のフォローフラグ 取得
            await axios.get('http://127.0.0.1:8000/api/get_follow_flag',{params: followData}).then(async(res) => {
                
                modalData.followFlag = await res.data.length
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

            commit('changemodal',modalData)

        //詳細が投稿の場合
        } else if(data.type === "detailPost"){

            const modalData ={
                type: data.type,
                postDetails:''
            }

            const postData ={
                postId: data.id,
                userNo: rootState.users.users[0].id
            }

            //該当の投稿データ 取得
            await axios.get('http://127.0.0.1:8000/api/get_post_details', {params: postData}).then(async(res) => {

                if(res.data){
                    //時間表記変更
                    //main 
                    var changeTime = new Date (Date.parse(res.data['post_details'][0]['created_at']))
                    res.data['post_details'][0]['created_at'] = changeTime.toLocaleString('ja')

                    //reply
                    var replyData = calculateTime(res.data['reply_details'])
                    res.data['reply_details'] = replyData

                    modalData.postDetails = await res.data
                    commit('changemodal',modalData)
                }else{
                    var data = {
                        type:'dontExist'
                    }
                    commit('changemodal',data)
                }
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })
        }
    },

    scroll({ commit },data){
        commit('scroll',data)
    },

    setScrollPosition({ commit }){
        commit('setScrollPosition')
    },

    close({ commit }){
        commit('close')
    },

    resetClose({ commit }){
        commit('resetClose')
    },

    scrolldelete({ commit }){
        commit('scrolldelete')
    },

    async followFlag({ commit,dispatch },data){
        var followData = {

            followingId: data.myId,
            followedId: data.id

        }

        await axios.get('http://127.0.0.1:8000/api/get_follow_flag', {params: followData}).then(async(res) => {
            console.log(res.data)
            await commit('followFlagChange',res.data.length)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //詳細モーダル ユーザーの場合でのユーザーのアクション時 再取得
    async detailsUserAction({ commit , rootState ,dispatch}){
        var data = {
            id: rootState.details.detailsList[0].userInfo[0].id,
            myNo: rootState.users.users[0].id
        }

        const detailsUpdateData = {
            postCount: '',
            userPost: '',
        }

        //投稿リスト 取得
        await axios.get('http://127.0.0.1:8000/api/get_user_post_details',{params: data}).then(async(res) =>{

            //時間表記変更
            var list = await calculateTime(res.data)
            detailsUpdateData.postCount = list.length
            detailsUpdateData.userPost = list

            commit('detailsUserAction',detailsUpdateData)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //詳細モーダル 投稿の場合でのユーザーのアクション時 再取得
    async detailsPostAction({ rootState, commit, dispatch }){

        var postData ={
            postId: rootState.details.detailsList[0].postDetails.post_details[0].post_id,
            userNo: rootState.users.users[0].id
        }

        await axios.get('http://127.0.0.1:8000/api/get_post_details', {params: postData}).then(async(res) => {

            //時間表記変更
            var replyData = await calculateTime(res.data['reply_details'])
            res.data['reply_details'] = replyData

            commit('detailsPostAction',res.data)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //詳細モーダルでのフォローアクション 再取得
    async detailsFollowAction({ commit , rootState, dispatch }){
        var data ={
            id: rootState.details.detailsList[0].userFollowInfo.user_id,
            myNo: rootState.users.users[0].id
        }
        console.log(data)

        await axios.get('http://127.0.0.1:8000/api/follow_info_details',{params: data}).then(async(res) => {
                console.log(res.data)
                await commit('detailsFollowAction',res.data)
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}

