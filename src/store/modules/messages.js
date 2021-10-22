import axios from 'axios'
import firebase from "firebase"

function calculateTime(data){
    //時間表記変更
    var now = Date.now()
    var i = 0

    for(i; i < data.length; i++){
        var time = data[i]['created_at']
        if(time !== null){
            var changeTime = new Date (Date.parse(time))
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
    }

    return data

}


//リアルタイムメッセージ通知 登録
async function addMessageData(userNo,uid){
    const db = firebase.database()
    db.ref('message/'+ uid ).push({
        user:{
            No:userNo,
        }
    })
}

const state = {
    //メッセージしているユーザーリスト
    message_list:'',

    //メッセージしているユーザーとのメッセージ内容
    message_contents:{
        user:[{
            user_id:'',
            user_name:'',
            userimage_url:'',
        }],
        message:[]
    },

    //メッセージで追加できるユーザーリスト
    message_followlist:'',
    
    //メッセージ通知数
    message_count:[]
}

const mutations = {

    setMessageList(state,data){
        state.message_list = data
    },

    setMessageContents(state,data){
        state.message_contents = data
    },

    setMessageId(state,data){
        state.message_contents.message_id = data
    },

    setMessageFollowList(state,data){
        state.message_followlist = data
    },

    resetMessageContents(state){
        state.message_contents = { user:[{ user_id:'', user_name:'', userimage_url:'',}] ,message:[] }
    },

    setMessageCount(state,data){
        state.message_count.unshift(data)
    },

    resetNotification(state){
        state.message_count = []
    }

}

const actions = {

    //メッセージしているユーザーリスト取得
    async getMessageList({ commit, rootState,dispatch }){
        var data = {
            id: rootState.users.users[0].id
        }
        await axios.get('http://127.0.0.1:8000/api/get_message_list',{params:data}).then(async(res)=>{
            await commit('setMessageList',calculateTime(res.data))
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //メッセージしているユーザーとのメッセージ内容取得
    async getMessageContents({ commit,dispatch },data){
        await axios.get('http://127.0.0.1:8000/api/get_message',{params:data}).then(async(res)=>{
            var temp = calculateTime(res.data.message)
            res.data.message = temp

            await commit('setMessageContents',res.data)
            commit('setMessageId',data.message_id)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //メッセージ投稿
    async addMessage({ rootState,dispatch },data){
        
        //メッセージに画像・動画が含まれているか
        var length = data.message_medhia.length

        //ユーザーuid取得
        const user = firebase.auth().currentUser.uid

        //画像・動画を保存する場合にtokenとして日付取得
        const token = Date.now()

        data.id = rootState.users.users[0].id

        //メッセージ投稿時、画像・動画があるならfirestoreに保存、保存場所のURL取得
        async function setData(i){
            var fileName = data.message_medhia[i].name
            
            var file = data.message_medhia[i].data[0]

            var metadata = {
                contentType:data.message_medhia[i].data[0].type
            }
        
            var refPath = 'users/' + user + '/files/message/' + token + '/' + fileName

            var storageRef = firebase.storage().ref(refPath)

            await storageRef.put(file,metadata).then(async() =>{
                await firebase.storage().ref(refPath).getDownloadURL().then(async(url) => {
                    if(i === 0){
                        data.first_medhia_url = await url
                        data.first_medhia_name = fileName
                        data.file_token = token
                    }else{
                        data.second_medhia_url = await url
                        data.second_medhia_name = fileName
                    }
                    
                }).catch(()=>{
                    dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                    return 
                })
            }).catch(()=>{
                dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

            //動画投稿の場合、サムネイル画像保存 URL取得
            if(data.video_thumbnail !== ''){
                var thumbnailMetadata = {
                    contentType:'image/jpeg'
                } 

                var thumbnailRefPath = 'users/' + user + '/files/message/' + token + '/thumbnail' + fileName
                
                var thumbnailStorageRef = firebase.storage().ref(thumbnailRefPath)

                await thumbnailStorageRef.put(data.video_thumbnail,thumbnailMetadata).then(async() =>{
                    await thumbnailStorageRef.getDownloadURL().then(async(url) => {
                        data.thumbnail_url = await url
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

        //メッセージ投稿時、画像・動画が含まれている場合
        if(length){
            
            for(var i = 0 ; i < length; i++ ){
                await setData(i)
            }

            delete data.message_medhia
            delete data.video_thumbnail

            await axios.get('http://127.0.0.1:8000/api/message',{ params:data }).then(async() => {
                var Info = {
                    message_id:data.message_id,
                    opponent_userno:rootState.messages.message_contents.user[0].id
                }
                await dispatch('getMessageContents',Info)
                await dispatch('getMessageList')
            }).catch(()=>{
                dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })

        }else{

            await axios.get('http://127.0.0.1:8000/api/message',{ params:data }).then(async() => {
                var Info = {
                    message_id:data.message_id,
                    opponent_userno:rootState.messages.message_contents.user[0].id
                }
                await dispatch('getMessageContents',Info)
                await dispatch('getMessageList')
            }).catch(()=>{
                dispatch('errorMessage','投稿に失敗しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })
            
        }

        //メッセージ投稿、該当するユーザーに通知
        if(data.opponent_id !== data.id){
            var uidData ={
                user_no:data.opponent_id
            }
            
            await axios.get('http://127.0.0.1:8000/api/get_uid',{params:uidData}).then(async(res)=>{
                await addMessageData(data.id,res.data[0].auth_id)
            }).catch(()=>{
                dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
                return 
            })
        }

    },

    //メッセージにユーザーを追加
    async addMessageList({rootState,dispatch},data){
        data.id = rootState.users.users[0].id
        console.log(data)
        await axios.get('http://127.0.0.1:8000/api/add_message_list',{params:data}).then(async()=>{
            await dispatch('getMessageList')
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //メッセージに追加できるユーザーリストを取得
    async getMessageFollowList({commit,rootState,dispatch}){
        var data = {
            id: rootState.users.users[0].id
        }

        await axios.get('http://127.0.0.1:8000/api/get_message_followlist',{params:data}).then(async(res)=>{
            await commit('setMessageFollowList',res.data)
        }).catch(()=>{
            dispatch('errorMessage','エラーが発生しました、時間をおいてからもう一度ご利用ください',{root:true})
            return 
        })
    },

    //メッセージの内容をリセット
    resetMessageContents({ commit }){
        commit('resetMessageContents')
    },

    //メッセージ通知数セット
    messageCount({ commit },data){
        commit('setMessageCount',data)
    },

    //メッセージ通知数リセット
    resetNotification({ commit }){
        commit('resetNotification')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}