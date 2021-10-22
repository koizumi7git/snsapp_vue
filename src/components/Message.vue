<template>
    <div class="message">
        <div class="message_header">
            <img class="message_icon" :src="require('@/assets/'+selectStyle.selectColor+'/message.png')" >
            <p>メッセージ</p>
            <div 
                class="add_message"
                v-if="messageContent.user[0].user_id === ''"
                @click="messageUserList()">
                <img 
                    class="plus"
                    :class="{active: messageUserListModal}" 
                    :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                    alt="addmessage">
                <img 
                    class="plus_hover"
                    :class="{active: messageUserListModal}" 
                    :src="require('@/assets/plus_on.png')" 
                    alt="addmessage">
            </div>
            <div
                v-if="messageUserListModal" 
                class="message_user_modal">
                <div class="header">
                    <p>ユーザー一覧</p>
                </div>
                <div class="user_list">
                    <div v-if="messageFollowList.length !== 0">
                        <div v-for="list in messageFollowList" :key="list.id" class="user_list_wrapper">
                            <div class="user_list_icon">
                                <div class="icon_wrapper">
                                    <img :src="list.userimage_url" alt="user_icon">
                                </div>
                            </div>
                            <div class="user_infomation">
                                <div class="user_infomation_wrapper">
                                    <p class="name">{{list.user_name}}</p><p class="id">{{list.user_id}}</p>
                                </div>
                            </div>
                            <div class="add">
                                <div 
                                    class="add_button"
                                    @click.prevent="addMessageList(list.followed_id)">
                                    <p>追加</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="messageFollowList.length === 0">
                        <p class="cant_massage">現在メッセージを送ることができるユーザーはいません。<br>メッセージを送る際はそのユーザーをフォローしてください。</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="message_contents">
            <div
                v-if="messageList.length !== 0"
                class="message_contents_wrapper">
                <div
                    v-for="list in messageList" :key="list.id">
                    <div 
                        class="message_list"
                        @click="messageModal(list.message_id,list.opponent_user)">
                        <div class="icon">
                            <div class="icon_wrapper">
                                <img :src="list.userimage_url" alt="user_icon">
                            </div>
                        </div>
                        <div class="message_list_contents">
                            <div class="infomation">
                                <p class="name">{{list.user_name}}</p><p class="id">{{list.user_id}}</p><p class="date">{{list.created_at}}</p>
                            </div>
                            <div class="latest_message">
                                <p>{{list.message}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="message_nonlist">
                <p>メッセージはありません</p>
            </div>
        </div>
        <!-- message modal -->
        <div 
            class="message_modal"
            v-if="messageContent.user[0].user_id !== ''">
            <div
                class="message_modal_header">
                <div 
                    class="back_button"
                    v-if="messageContent.user[0].user_id !== ''"
                    @click.prevent="closeMessageContents()">
                    <img src="@/assets/back_black.png" alt="backbutton">
                    <p>戻る</p>
                </div>
                <div class="image_wrapper">
                    <img :src="messageContent.user[0].userimage_url" alt="">
                </div>
                <div class="message_modal_user">
                    <p>{{messageContent.user[0].user_name}}</p>
                    <p>{{messageContent.user[0].user_id}}</p>
                </div>
            </div>
            <div
                class="message_modal_contents">
                <MessageList v-for="list in messageContent.message" :list="list" :key="list.id"/>
            </div>
            <div
                class="message_modal_footer">
                <div class="input_message">
                    <div class="message_medhia">
                        <div v-for="medhia in messageViewMedhia" :key="medhia.id">
                            <div class="medhia_preview">
                                <video
                                    v-if="medhia.type === 'video/mp4' && medhia.data !== ''" 
                                    :src="medhia.data" controls></video>
                                <img
                                    v-else
                                    :src="medhia.data" alt="">
                                <div 
                                    class="medhia_cancel"
                                    @click.stop="cancelMedhia(medhia.name)">
                                    <img src="@/assets/medhia_cancel.png" alt="medhiacancel">
                                </div>
                            </div>
                        </div>
                    </div>
                    <textarea 
                        type="text"
                        ref="taHeight"
                        v-model="message"
                        @keydown="adjustHeight(message)"
                        rows="1">
                    </textarea>
                </div>
                <div class="medhia_button">
                    <label for="message_medhia_file"><img :src="require('@/assets/'+selectStyle.selectColor+'/image.png')" alt="メディア" ></label>
                    <input type="file"  accept="image/*, video/*" id="message_medhia_file" @change="messageFileChange">
                </div>
                <div class="message_button">
                    <div 
                        class="button"
                        @click.prevent="addMessage()">
                        <p>送信</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import MessageList from '@/components/MessageList.vue'

export default {

    components:{
        MessageList,
    },
    
    data(){
        return{
            messageUserListModal: false, //メッセージを追加できるユーザーリストのモーダルフラグ
            message:"", //メッセージ内容
            messageViewMedhia:[], //メッセージ投稿時、画像・動画のプレビュー格納
            messageMedhiaFiles:[], //メッセージ投稿時、画像・動画が含まれている場合ファイル格納
            thumbnailData:"", //メッセージ投稿時、動画が含まれている場合、サムネイル画像格納
        }
    },

    methods:{
        //メッセージを追加できるユーザーリストモーダルの開閉
        messageUserList(){
            this.messageUserListModal = !this.messageUserListModal
        },

        //メッセージモーダル開 データ取得
        async messageModal(id,user){
            var data = {
                message_id:id,
                opponent_userno:user
            }
            await this.$store.dispatch('messages/getMessageContents',data)

            //メッセージモーダル展開時、最新メッセージ下部へ移動s
            var element = document.documentElement;
            var bottom = element .scrollHeight - element .clientHeight;
            scrollTo(0, bottom);
        },

        //メッセージモーダル閉  値リセット
        closeMessageContents(){
            this.$store.state.messages.message_contents = { user:[{ user_id:'', user_name:'', userimage_url:'',}] ,message:[] }
            this.message = ""
        },

        //メッセージ送信
        async addMessage(){
            var data = {
                message:this.message,
                message_id:this.messageContent.message_id,
                opponent_id:this.messageContent.user[0].id,
                message_medhia: this.messageMedhiaFiles,
                video_thumbnail: this.thumbnailData
            }
            await this.$store.dispatch('messages/addMessage',data)
            
            //メッセージの投稿が完了時、関連する値リセット
            this.message = ""
            this.messageViewMedhia = [] 
            this.messageMedhiaFiles= [] 
            this.thumbnailData = ""
            const textarea = this.$refs.taHeight
            textarea.style.height = '1.6rem'
            
        },

        //ユーザーをメッセージリストに追加
        async addMessageList(id){
            var data ={
                opponent_id:id
            }

            await this.$store.dispatch('messages/addMessageList',data)
            this.messageUserList()

        },

        //メッセージ textarea 縦幅変更
        adjustHeight(val){
            const textarea = this.$refs.taHeight
            textarea.style.height = 'auto'
            if(this.massage !== ""){
                if(val.length > 40){
                    textarea.style.height = textarea.scrollHeight + 'px'
                }
            }else{
                textarea.style.height = '0'
            }
            
        },

        //メッセージ画像・動画プレビューのキャッシュクリア
        cacheClear(){
            const fileobj = document.getElementById('message_medhia_file');
            fileobj.value = null
        },

        //メッセージ画像・動画のファイルデータ取得
        messageFileChange(e){
            const fileobj = document.getElementById('message_medhia_file');
            console.log(fileobj.value.length)

            if(fileobj.value.length > 0){
                    //投稿ファイルのバリデーション
                if(this.messageViewMedhia.length > 1){
                    alert('画像は2つまでしか投稿できません')
                }else{

                    var fileData = e.target.files || e.dataTransfer.files
                    var fileName = fileData[0].name
                    console.log(fileName)
                    var temp = this.messageViewMedhia.map(el => el.type)
                    var flag = temp.includes('video/mp4')

                    if(flag || (fileData[0].type === 'video/mp4' && this.messageViewMedhia.length > 0)){
                        alert('動画を投稿する際は、他のメディアを追加できません')
                    }else{
                        this.createPreMedhia(fileData[0])
                        this.messageMedhiaFiles[this.messageMedhiaFiles.length] = Object.assign({},this.messageMedhiaFiles[this.messageMedhiaFiles.length],{data:fileData,name:fileName})
                    }
                }
            } 
        },

        //メッセージ画像・動画のプレビュー作成
        createPreMedhia(file){
            var reader = new FileReader()
            reader.onload = async (e) => {
                if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'||file.type === 'video/mp4'){
                    if(file.type === 'video/mp4'){
                        await this.createThumbnail(e.target.result)
                    }
                    this.messageViewMedhia[this.messageViewMedhia.length] = Object.assign({},this.messageViewMedhia[this.messageViewMedhia.length],{type:file.type , name:file.name ,data:e.target.result})
                }else{
                    console.log('このファイルは投稿できません')
                }
            }
            reader.readAsDataURL(file)        
        },

        //バイナリデータをBlobに変換
        changeBlob(data){
            var bin = atob(data.replace(/^.*,/, ''))
            var buffer = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length;i++){
                buffer[i] = bin.charCodeAt(i);
            }
            var blob = new Blob([buffer.buffer], {type: 'image/jpeg'});
            return blob;
        },

        //サムネイル画像作成
        createThumbnail(data){
            const video = document.createElement('video')
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            video.onloadeddata= () =>{
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                console.log(canvas.width)
                console.log(canvas.height)
                video.currentTime = 1
            }

            video.onseeked = () =>{
                context.drawImage(video,0,0,video.videoWidth,video.videoHeight)
                this.thumbnailData = this.changeBlob(canvas.toDataURL('image/jpeg',1.0))
                console.log(this.thumbnailData)
            }

            video.src = data
            video.load()

        },

        //画像、動画投稿時、選択したものをキャンセル
        cancelMedhia(val){
            //キャンセルに該当するプレビューデータ削除
            var firstTemp = this.messageViewMedhia.map(el => el.name)
            var firstNumber = firstTemp.indexOf(val)
            this.messageViewMedhia.splice(firstNumber,1)

            //キャンセルに該当する送信データ削除
            var secondTemp = this.messageMedhiaFiles.map(el => el.name)
            var secondNumber = secondTemp.indexOf(val)
            this.messageMedhiaFiles.splice(secondNumber,1)

            this.thumbnailData = ""

            //input file のキャッシュクリア
            this.cacheClear()
        },
    },
    
    watch:{
        //メッセージ textarea 縦幅変更
        'message':function(val){
            if(val.length > 40){
                this.adjustHeight(val)
            }
        }
    },
    computed: {
        //メッセージリスト 取得
        messageList(){
            return this.$store.state.messages.message_list
        },

        //メッセージ 内容取得
        messageContent(){
            return this.$store.state.messages.message_contents
        },

        //メッセージ ユーザー追加リスト取得
        messageFollowList(){
            return this.$store.state.messages.message_followlist
        },

        //select mode color 取得
        selectStyle() {
            return {
                'currentModeType':this.$store.state.users.users[0].mode,
                'modeType':this.$store.state.mode[0].type,
                '--modeMainBackGround':this.$store.state.mode[0].main_color,
                'modeMainBackGround':this.$store.state.mode[0].main_color,
                '--modeSubBackGround':this.$store.state.mode[0].sub_color,
                '--modeTextColor':this.$store.state.mode[0].text_color,
                '--modeBorderColor':this.$store.state.mode[0].border_color,
                '--inputColor': this.$store.state.mode[0].input_color,
                'currentColorType': this.$store.state.users.users[0].color,
                'colorType': this.$store.state.color[0].type,
                '--selectColor': this.$store.state.color[0].value,
                'selectColor': this.$store.state.color[0].value
            }
        }
    },
}

</script>


<style lang="scss" scoped>
    @mixin flex{
        display:flex;
    }

    @mixin flexCenter{
        display:flex;
        justify-content: center;
        align-items: center;
    }

    @mixin mainBackground{
        background: var(--modeMainBackGround);
    }

    @mixin subBackGround{
        background: var(--modeSubBackGround);
    }

    @mixin backSelectColor{
        background: var(--selectColor);
    }

    .message{
        width: 800px;
        height: 100%;
        background-color: #141414;
        position:relative;

        &_header{
            height:3rem;
            border-bottom: 1px solid var(--modeBorderColor);
            @include flexCenter;
            position: sticky;
            top:4rem;
            width: 800px;
            @include mainBackground;
            user-select:none;
            z-index:5;
            .message_icon{
                width: 26px;
                height: 26px;
                margin-right:10px;
            }

            p{
                font-size: 20px;
            }

            .add_message{
                position:absolute;
                right:20px;
                @include flexCenter;

                .plus{
                    width: 26px;
                    height: 26px;
                    transform:rotate(45deg);
                }

                .plus_hover{
                    width: 26px;
                    height: 26px;
                    transform:rotate(45deg);
                    display:none;
                }

                &:hover{
                    cursor: pointer;

                    .plus{
                        display:none;
                    }

                    .plus_hover{
                        display:inline;
                    }

                    .plus.active{
                        display:none;
                    }

                    .plus_hover.active{
                        display:inline;
                    }

                }

                
                .plus.active{
                    z-index: 10;
                    transform:rotate(0);
                    
                }


                .plus_hover.active{
                    width: 26px;
                    height: 26px;
                    z-index: 10;
                    transform:rotate(0);
                    display:none
                    
                }

            }

            .message_user_modal{
                width: 460px;
                position: absolute;
                top: 5px;
                right: 10px;
                @include mainBackground;
                border:1px solid var(--modeBorderColor);
                border-radius:6px;
                
                .header{
                    width: 458px;
                    height:40px;
                    border-bottom:2px solid var(--modeBorderColor);
                    @include flexCenter;
                }

                .user_list{
                    width: 458px;
                    padding:2px;
                    @include flex;
                    align-items: center;
                    flex-direction: column;

                    &_wrapper{
                        width: 454px;
                        margin: 1px 0;
                        @include subBackGround;
                        @include flex;

                        .user_list_icon{
                            width: 70px;
                            height: 60px;
                            @include flexCenter;

                            .icon_wrapper{
                                width: 56px;
                                height: 56px;

                                img{
                                    width: 100%;
                                    height: 100%;
                                    object-fit: contain;
                                    background: black;
                                    border-radius: 6px;
                                }
                            }
                        }

                        .user_infomation{
                            width: 300px;
                            height: 60px;
                            @include flexCenter;

                            &_wrapper{
                                width: 280px;
                                height: 60px;
                                @include flexCenter;
                                flex-direction: column;

                                .name{
                                    width: 100%;
                                    height: 30px;
                                    font-size:16px;
                                    line-height: 30px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap; 
                                }
                                .id{
                                    width: 100%;
                                    height: 30px;
                                    font-size:16px;
                                    line-height: 30px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap; 
                                }
                            }
                        }

                        .add{
                            width: 84px;
                            @include flexCenter;

                            .add_button{
                                width: 50px;
                                height: 28px;
                                border-radius: 10px;
                                @include backSelectColor;
                                @include flexCenter;

                                p{
                                    color:black;
                                    font-weight: bold;
                                    font-size:14px;
                                }

                                &:hover{
                                    cursor: pointer;
                                    background: #11ec98;
                                }
                            }
                        }
                    }

                    .cant_massage{
                        margin:20px 0;
                        font-size:14px;
                    }

                }
            }
        
        }

        &_contents{
            min-height: calc(100vh - 7rem);

            &_wrapper{
                height: calc(100vh - 7rem);
                @include flex;
                align-items: center;
                flex-direction: column;
                padding-top: 4px;
                padding-bottom: 2px;

                .message_list{
                    width: 792px;
                    height: 80px;
                    @include subBackGround;
                    margin-bottom:2px;
                    @include flex;
                    align-items: center; 

                    &:hover{
                        cursor: pointer;
                    }

                    .icon{
                        width: 80px;
                        height: 80px;
                        @include flexCenter;

                        &_wrapper{
                            width: 60px;
                            height: 60px;

                            img{
                                width: 100%;
                                height: 100%;
                                object-fit: contain;
                                background: black;
                                border-radius: 6px;
                            }
                        }
                    }

                    &_contents{
                        width: 712px;
                        height: 80px;
                        @include flexCenter;
                        flex-direction: column;

                        .infomation{
                            width: 700px;
                            height: 20px;
                            display: flex;

                            .id{
                                margin-left:4px;
                                color:rgb(123, 123, 123);
                            }
                            .date{
                                position: absolute;
                                right:20px;
                                height: 20px;
                            }
                        }

                        .latest_message{
                            width: 700px;
                            height: 40px;
                            @include flex;
                            align-items: center;

                            p{
                                width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap; 
                            }
                        }
                    }

                }
            }

            .message_nonlist{
                @include flexCenter;
                height: calc(100vh - 7rem);
            }
        }

        .message_modal{
            position:absolute;
            top:0;
            left:0;
            width: 800px;
            min-height: calc(100vh - 4rem);
            @include mainBackground;
            z-index:10;

            &_header{
                height: 4rem;
                width: 100%;
                @include mainBackground;
                border-bottom:1px solid var(--modeBorderColor);
                @include flexCenter;
                position:sticky;
                top:4rem;
                z-index: 15;
                .back_button{
                    height:30px;
                    width: 60px;
                    background: red;
                    position:absolute;
                    left: 20px;
                    @include flexCenter;
                    border-radius: 6px;
                    @include backSelectColor;

                    img{
                        height:20px;
                        width: 20px;
                    }

                    p{
                        font-size:16px;
                        font-weight: bold;
                        color:#000000;
                    }

                    &:hover{
                        cursor: pointer;
                        background: #11ec98;
                    }
                }
                
                .image_wrapper{
                    width: 54px;
                    height: 54px;
                    margin-right:10px;
                    img{
                        width:100%;
                        height:100%;
                        object-fit: contain;
                        background: #000000;
                        border-radius: 6px;
                    }
                }

                .message_modal_user{
                    @include flexCenter;
                    flex-direction: column;
                }

            }

            &_contents{
                @include mainBackground;
                min-height: calc(100vh - 11rem - 46.59px);
                padding:4px 0;
                margin-bottom:46.59px;
            }

            &_footer{
                width: 800px;
                border-top:1px solid var(--modeBorderColor);
                @include mainBackground;
                position:fixed;
                bottom: 0;
                z-index: 15;
                @include flexCenter;

                .input_message{
                    width: 600px;
                    height: 100%;
                    @include flexCenter;
                    flex-direction: column;
                    margin:10px;

                    .message_medhia{
                        width: 500px;
                        @include flexCenter;
                        margin-bottom: 5px;

                        .medhia_preview{
                            width: 70px;
                            height: 70px;
                            margin:5px 10px;
                            @include flexCenter;
                            position:relative;

                            .medhia_cancel{
                                width: 16px;
                                height: 16px;
                                position:absolute;
                                top:3px;
                                right:3px;
                                background: black;
                                border-radius: 5px;
                                z-index:10;
                                @include flexCenter;

                                img{
                                    object-fit: contain;
                                    width:100%;
                                    height:100%;
                                }

                                &:hover{
                                    cursor:pointer;
                                }
                            }

                            img{
                                object-fit: contain;
                                width:100%;
                                height:100%;
                            }

                            video{
                                object-fit: contain;
                                width:100%;
                                height:100%;
                            }   
                        }
                    }

                    textarea{
                        width: 580px;
                        height: 1.6rem;
                        border-radius: 10px;
                        border: none;
                        outline: none;
                        overflow: hidden;
                        padding: 6px 10px;
                        resize: none;
                        @include subBackGround;
                        color:#ffffff;
                    }
                }

                .medhia_button{
                    width: 60px;
                    height: 100%;
                    @include flexCenter;
                    
                    img{
                        width: 30px;
                        height: 30px;
                        margin-top: 7px;
                    }

                    #message_medhia_file{
                        display:none;
                    }
                    
                    :hover{
                        cursor: pointer;
                    }
                }

                .message_button{
                    width: 70px;
                    height: 100%;
                    @include flexCenter;

                    .button{
                        width: 50px;
                        height: 28px;
                        @include backSelectColor;
                        border-radius: 10px;
                        @include flexCenter;

                        p{
                            font-weight: bold;
                            color: black;
                        }

                        &:hover{
                            cursor: pointer;
                            background: #11ec98;
                        }
                    }
                }
            }
        }
    }

</style>