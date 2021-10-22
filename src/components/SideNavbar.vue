<template>
    <aside class="sidenavbar" :style="selectStyle">
        <ul class="sidenavbar_list">
            <li 
                class="sidenavbar_item"
                :class="{active: isActive('timeline')}"
                @click="changeActive('timeline')">
                <p>タイムライン</p>
                <img 
                    :src="isActive('timeline') ? require('@/assets/'+selectStyle.selectColor+'/home.png') : require('@/assets/home.png')" 
                    alt="timelineIcon">
                <span v-show="isActive('timeline')"></span>
            </li>
            <li 
                class="sidenavbar_item"
                :class="{active: isActive('search')}"
                @click="changeActive('search')">
                <p>検索</p>
                <img 
                    :src="isActive('search') ? require('@/assets/'+selectStyle.selectColor+'/search.png') : require('@/assets/serch.png')" 
                    alt="searchIcon">
                <span v-show="isActive('search')"></span>
            </li>
            <li 
                class="sidenavbar_item"
                :class="{active: isActive('notification')}"
                @click="changeActive('notification')">
                <div 
                    class="read_count"
                    v-if="notificationUnreadCount !== 0">
                    <div class="read_count_wrapper">
                        <div v-if="notificationUnreadCount > 99">
                            <p>99+</p>
                        </div>
                        <div>
                            <p>{{notificationUnreadCount}}</p>
                        </div>
                    </div>
                </div>
                <p>通知</p>
                <img 
                    :src="isActive('notification') ? require('@/assets/'+selectStyle.selectColor+'/bell.png') : require('@/assets/bell.png')" 
                    alt="notificationIcon">
                <span v-show="isActive('notification')"></span>
            </li>
            <li 
                class="sidenavbar_item"
                :class="{active: isActive('message')}"
                @click="changeActive('message')">
                <div 
                    class="read_count message"
                    v-if="messageNotificationCount !== 0">
                    <div class="read_count_wrapper">
                        <div v-if="messageNotificationCount > 99">
                            <p>99+</p>
                        </div>
                        <div v-else>
                            <p>{{messageNotificationCount}}</p>
                        </div>
                    </div>
                </div>
                <p>メッセージ</p>
                <img 
                    :src="isActive('message') ? require('@/assets/'+selectStyle.selectColor+'/message.png') : require('@/assets/message.png')" 
                    alt="messageIcon">
                <span v-show="isActive('message')"></span>
            </li>
            <li 
                class="sidenavbar_item"
                :class="{active: isActive('profile')}"
                @click="changeActive('profile')">
                <p>プロフィール</p>
                <img 
                    :src="isActive('profile') ? require('@/assets/'+selectStyle.selectColor+'/profile.png') : require('@/assets/profile.png')" 
                    alt="profileIcon">
                <span v-show="isActive('profile')"></span>
            </li>
            <li 
                class="sidenavbar_item"
                :class="{active: isActive('setting')}"
                @click="changeActive('setting')">
                <p>設定</p>
                <img 
                    :src="isActive('setting') ? require('@/assets/'+selectStyle.selectColor+'/setting.png') : require('@/assets/setting.png')" 
                    alt="settingIcon">
                <span v-show="isActive('setting')"></span>
            </li>
        </ul>
        <div 
            class="post"
            @click="postModalShow">
            <img src="@/assets/post_w.png" alt="postIcon" class="post_img">
            <p>投稿</p>
        </div>
    </aside>

    <!-- postModal -->
    <div 
        class="overlay"
        v-show="postModalValue"
        :style="selectStyle"
        @click.self="postModalClose()">
        <div class="post_modal">
            <div class="post_modal_header">
                <div class="close_button" @click="postModalClose()">
                    <img 
                        :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                        alt="close"
                        class="close">
                    <img 
                        :src="require('@/assets/plus_on.png')" 
                        alt="close"
                        class="close_hover">
                </div>
            </div>
            <div class="post_modal_contents">
                <textarea
                    type="text"
                    v-model="postMsg"
                    placeholder="ここに入力">
                </textarea>
                <div 
                    class="post_preview_wrapper"
                    v-if="postViewMedhia.length">
                    <div v-for="medhia in postViewMedhia" :key="medhia.id">
                        <div class="post_preview_medhia">
                            <div 
                                class="medhia_cancel"
                                @click.stop="cancelMedhia(medhia.name)">
                                <img src="@/assets/medhia_cancel.png" alt="medhiacancel">
                            </div>
                            <video
                                v-if="medhia.type === 'video/mp4' && medhia.data !== ''" 
                                :src="medhia.data" controls></video>
                            <img
                                v-else
                                :src="medhia.data" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="post_footer">
                <div class="post_medhia">
                    <label for="medhia_file"><img :src="require('@/assets/'+selectStyle.selectColor+'/image.png')" alt="メディア" ></label>
                    <input type="file"  accept="image/*, video/*" id="medhia_file" @change="postFileChange">
                </div>
                <div 
                    class="post_button"
                    @click="addPost()">
                    投稿
                </div>
            </div>
        </div>
    </div>

    <!-- reply modal  -->
    <div 
        class="overlay"
        v-if="replymodal[0]"
        :style="selectStyle"
        @click.self="replyModalClose()">
        <div class="reply_modal">
            <div class="reply_modal_header">
                <div class="close_button" @click.stop="replyModalClose()">
                    <img 
                        :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                        alt="close"
                        class="close">
                    <img 
                        :src="require('@/assets/plus_on.png')" 
                        alt="close"
                        class="close_hover">
                </div>
            </div>
            <div class="blank">
                <div class="blank_content">
                </div>
            </div>
            <div class="reply_modal_list">
                <List v-for="list in replymodal" :list="list" :key="list.id"/>
            </div>
            <div class="blank">
                <div class="blank_content">
                </div>
            </div>
        </div>
        <div class="reply_message">
            <div>
                <textarea
                    type="text"
                    v-model="replyMsg"
                    placeholder="返信内容を入力"
                    ref="taHeight"
                    @keydown="adjustHeight">
                </textarea>
                <div 
                    class="post_preview_wrapper"
                    v-if="postViewMedhia.length">
                    <div v-for="medhia in postViewMedhia" :key="medhia.id">
                        <div class="post_preview_medhia">
                            <div 
                                class="medhia_cancel"
                                @click.stop="cancelMedhia(medhia.name)">
                                <img src="@/assets/medhia_cancel.png" alt="medhiacancel">
                            </div>
                            <video
                                v-if="medhia.type === 'video/mp4' && medhia.data !== ''" 
                                :src="medhia.data" controls></video>
                            <img
                                v-else
                                :src="medhia.data" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="reply_footer">
                <div class="reply_medhia">
                    <label for="medhia_file"><img :src="require('@/assets/'+selectStyle.selectColor+'/image.png')" alt="メディア" ></label>
                    <input type="file"  accept="image/*, video/*" id="medhia_file" @change="postFileChange">
                </div>
                <div 
                    class="button"
                    @click.prevent="reply(replymodal[0].post_id)">
                    <p>返信</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import List from '@/components/List.vue';
import firebase from 'firebase';

    export default {
        components:{
            List,
        },

        data() {
            return {
                //投稿モーダルフラグ
                postModalValue: false,
                //投稿文章
                postMsg: "",
                //投稿時、画像・動画のプレビュー
                postViewMedhia:[],
                //投稿時、画像・動画ファイル格納
                postMedhiaFiles:[],
                //返信文章
                replyMsg: '',
                //投稿時、動画が含まれている場合、サムネイル画像格納
                thumbnailData:'',
            }
        },

        methods: {

            //サイドメニューのアクティブ
            isActive(nextPage) {
                return this.currentPage === nextPage
            },

            //サイドメニューのページ変更
            async changeActive(nextPage) {
                this.$store.dispatch("changePage", nextPage)

                //タイムラインが選ばれた場合、5つのリスト再取得、通知関連をリセット
                if(nextPage === 'timeline'){
                    this.$store.dispatch('allReload')
                    await firebase.database().ref('timeline/'+ firebase.auth().currentUser.uid).remove()
                    this.$store.dispatch('posts/resetTimelineGetFlag')
                }

                //メッセージが選ばれた場合、メッセージリストとメッセージフォローリスト取得
                if(nextPage === 'message'){
                    await this.$store.dispatch('messages/getMessageList')
                    await this.$store.dispatch('messages/getMessageFollowList')
                    firebase.database().ref('message/'+ firebase.auth().currentUser.uid).remove()
                    await this.$store.dispatch('messages/resetNotification')
                }

                //メッセージ内容が開いている場合、リセット
                if(this.$store.state.messages.message_contents.user.user_id !== ''){
                    await this.$store.dispatch('messages/resetMessageContents')
                }

                //通知が選ばれた場合、通知リスト取得、通知関連をリセット
                if(nextPage === 'notification'){
                    await this.$store.dispatch('posts/notificationList')
                    firebase.database().ref('notification/'+ firebase.auth().currentUser.uid).remove()
                    await this.$store.dispatch('posts/resetNotification')
                }
                
                //詳細モーダル開いている場合、どれかのメニューがクリックされたら、詳細モーダル閉
                if(this.$store.state.details.detailsList[0]){
                    await this.$store.dispatch('details/resetClose')
                }

                //検索ページで検索機能が実行されている場合、どれかのメニューがクリックされたら、検索ワード、取得リスト等リセット
                if(this.$store.state.posts.searchList.search_post.length !== 0 || this.$store.state.posts.searchList.search_user.length !== 0){
                    await this.$store.dispatch('posts/resetSearch')
                }
                
                //それぞれのメニューからページ移動時、スクロール位置をトップに
                scrollTo(0,0)
            },

            //投稿モーダル 開
            postModalShow() {
                this.postModalValue = !this.postModalValue
            },

            //投稿モーダル 閉、投稿に関する値をリセット
            postModalClose() {
                this.postViewMedhia = []
                this.postMedhiaFiles = []
                this.cacheClear()
                this.postModalShow()
                this.postMsg = ""
                this.thumbnailData = ""
            },

            //投稿
            async addPost(){

                //投稿文章(URLが含まれているか)のバリデーションチェック
                const newPostMsg = this.urlValidation(this.postMsg)

                var postData = {
                    post_id: this.postUserId,
                    post_message: newPostMsg,
                    post_medhia: this.postMedhiaFiles,
                    video_thumbnail : this.thumbnailData
                }

                if(postData.post_message === ""){
                    postData.post_message = null
                }
                
                await this.$store.dispatch("posts/postData",postData)
                this.postModalClose()
            },

            //投稿 文章にurlが含まれているかどうか
            urlValidation(value){
                var msg = value
                const reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/g
                var tempUrl = msg.match(reg)
                
                //もしURLが含まれている場合はリンクタグ追加
                if(tempUrl){
                    var replaceUrl = []
                    for(var i = 0 ; i < tempUrl.length; i++){
                        replaceUrl[i] = '<a href="'+ tempUrl[i] +'">' + tempUrl[i] + ' </a>'
                        msg = msg.replace(tempUrl[i], replaceUrl[i])
                    }
                    return  msg
                }else{
                    return value
                }
            },

            //投稿画像・動画プレビューのキャッシュクリア
            cacheClear(){
                const fileobj = document.getElementById('medhia_file');
                fileobj.value = null
            },

            //投稿画像・動画のファイルデータ取得
            postFileChange(e){
                const fileobj = document.getElementById('medhia_file');

                if(fileobj.value.length > 0){
                    //投稿ファイルのバリデーション
                    if(this.postViewMedhia.length > 1){
                        alert('画像は2つまでしか投稿できません')
                    }else{

                        var fileData = e.target.files || e.dataTransfer.files
                        var fileName = fileData[0].name
                        
                        var temp = this.postViewMedhia.map(el => el.type)
                        var flag = temp.includes('video/mp4')

                        if(flag || (fileData[0].type === 'video/mp4' && this.postViewMedhia.length > 0)){
                            alert('動画を投稿する際は、他のメディアを追加できません')
                        }else{
                            this.createPreMedhia(fileData[0])
                            this.postMedhiaFiles[this.postMedhiaFiles.length] = Object.assign({},this.postMedhiaFiles[this.postMedhiaFiles.length],{data:fileData,name:fileName})
                        }
                    }
                }
                
            },

            //投稿画像・動画のプレビュー作成
            createPreMedhia(file){
                var reader = new FileReader()
                reader.onload = async (e) => {
                    if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'||file.type === 'video/mp4'){
                        if(file.type === 'video/mp4'){
                            await this.createThumbnail(e.target.result)
                        }
                        this.postViewMedhia[this.postViewMedhia.length] = Object.assign({},this.postViewMedhia[this.postViewMedhia.length],{type:file.type , name:file.name ,data:e.target.result})
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

            //動画の場合、サムネイル画像作成
            createThumbnail(data){
                const video = document.createElement('video')
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')

                video.onloadeddata= () =>{
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
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
                var firstTemp = this.postViewMedhia.map(el => el.name)
                var firstNumber = firstTemp.indexOf(val)
                this.postViewMedhia.splice(firstNumber,1)

                //キャンセルに該当する送信データ削除
                var secondTemp = this.postMedhiaFiles.map(el => el.name)
                var secondNumber = secondTemp.indexOf(val)
                this.postMedhiaFiles.splice(secondNumber,1)

                //input file のキャッシュクリア
                this.cacheClear()
            },

            //返信モーダル閉 返信に関する値リセット
            replyModalClose(){
                this.$store.dispatch('posts/resetReplyValue')
                this.cacheClear()
                this.postViewMedhia = []
                this.postMedhiaFiles = []
                this.replyMsg = ""
                this.thumbnailData = ""
            },

            //返信
            async reply(id){
                const data = {
                    replied_id: id,
                    reply_message: this.replyMsg,
                    user_id:'',
                    reply_medhia: this.postMedhiaFiles,
                    video_thumbnail : this.thumbnailData,
                    post_user_no:this.replymodal[0].user_no,
                }

                if(data.reply_message === ""){
                    data.reply_message = null
                }

                await this.$store.dispatch("posts/replyData",data)
                this.replyModalClose()
                scrollTo(0,0)
            },

            //返信時のtextare 縦幅変更
            adjustHeight(){
                const textarea = this.$refs.taHeight
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight + 'px'
            }

        },

        computed: {
            //現在選択してるページ
            currentPage(){
                return this.$store.state.currentPage;
            },

            //投稿時における自分のID
            postUserId(){
                return this.$store.state.users.users[0].id;
            },

            //リプライイベント取得
            replymodal(){
                return this.$store.state.posts.replyedValue
            },

            //通知数 取得
            notificationUnreadCount(){
                return this.$store.state.posts.notificationCount.length
            },

            //メッセージ通知数 取得
            messageNotificationCount(){
                return this.$store.state.messages.message_count.length
            },

            //select mode color 取得
            selectStyle() {
                return {
                    '--modeMainBackGround':this.$store.state.mode[0].main_color,
                    '--modeSubBackGround':this.$store.state.mode[0].sub_color,
                    '--modeTextColor':this.$store.state.mode[0].text_color,
                    '--modeBorderColor':this.$store.state.mode[0].border_color,
                    '--selectColor': this.$store.state.color[0].value,
                    'selectColor': this.$store.state.color[0].value,
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

    @mixin textColor{
        color:var(--modeTextColor);
    }

    @mixin hoverCursor{
        cursor: pointer;
    }

    @mixin userSelect{
        user-select: none;
    }

    @mixin hoverColor{
        background: #11ec98;
    }

    @mixin closeButton{
        .close{
            width: 20px;
            height: 20px;
            margin :auto;
        }
        .close_hover{
            width: 20px;
            height: 20px;
            margin :auto;
            display:none;
        }

        &:hover{
            cursor:pointer;

            .close{
                display:none;
            }

            .close_hover{
                display:inline-block;
            }       
        }
    }

    @mixin medhiaPreview{
        .post_preview_wrapper{
            padding:10px 0;
            @include flexCenter;
            border-top: 1px solid var(--modeBorderColor);

            .post_preview_medhia{
                margin:0 8px;
                width: 192px;
                height: 108px;
                background: #000000;
                position:relative;

                .medhia_cancel{
                    width: 20px;
                    height: 20px;
                    position:absolute;
                    top:5px;
                    right:5px;
                    background: black;
                    border-radius: 5px;
                    z-index:10;

                    &:hover{
                        @include hoverCursor;
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
    }

    p {
        @include textColor;
    }

    .sidenavbar {
        @include mainBackground;
        border-right:1px solid var(--modeBorderColor);
        height: calc(100vh - 4rem);
        width: 256px;
        position: fixed;
        
        &_list {
            padding-top: 4rem;
            list-style: none;

            & p{
                @include userSelect;
            }
        }
        &_item {
            width: 62%;
            margin: 0 38px;
            margin-top: 2rem;
            @include flex;
            align-items: center;
            justify-content: flex-end;
            position:relative;
            opacity: 0.4;
            &:hover{
                @include hoverCursor;
            }

            &:not(.active) p{
                padding-right: 10px;
                font-size: 18px;
                font-weight: bold;
                opacity: 0.3;
            }
            &:before{
                content:'';
                z-index:-1;
                display: block;
                width: 160%;
                height: 2px;
                position: absolute;
                background: linear-gradient(70deg, #f79533,  #ef4e7b, #a166ab, #1098ad, #07b39b, #24d350);
                bottom: 0;
                right: -3px;
            }
            &.active:after{
                content:'';
                z-index:30;
                display: block;
                width: 4%;
                height: 2px;
                position: absolute;
                background: #fff;
                border-radius: 70%;
                bottom:0;
                transform:translateX(-250px);
                animation: scan 1.2s ease-in-out infinite;
            }

            span {
                position: absolute;
                bottom: -4px;
                right: -11px;
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #24d350;
                animation: cricle 0.6s ease;
            }

            .read_count{
                width: 42px;
                height: 30px;
                position: absolute;
                top: -2px;
                left: 38px;
                display: flex;
                justify-content: flex-end;
                align-items: center;

                &_wrapper{
                    background: var(--selectColor);
                    border-radius:20px;
                    p{  
                        padding: 1px 7px;
                        margin:2px;
                        text-align: center;
                        font-size:13px;
                        font-weight: bold;
                        color:#000000;
                        opacity: 1;
                    }
                }
            }

            .read_count.message{
                left:-16px;
            }
        }
    }

    .active {
        animation:slide 0.3s ease;
        transform:translateX(53px);
        opacity: 1;
        p{
            padding-right: 10px;
            font-size: 18px;
            font-weight: bold;
        }
    }

    img {
        width: 26px;
        height: 26px;
        margin-bottom: 4px;
    }

    .post {
        width: 70%;
        height: 46px;
        background: linear-gradient(30deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
        border-radius: 20px;
        margin: 0 auto;
        margin-top: 2rem;
        font-size: 18px;
        font-weight: bold;
        @include flex;
        align-items: center;
        position:relative;
        &:after{
            content:'';
            z-index: 2;
            position: absolute;
            display: block;
            border-radius: 20px;
            width:96%;
            height:84%;
            left:4px;
            @include mainBackground;
        }

        &:hover{
            @include hoverCursor;
        }

        img {
            z-index: 8;
            margin-left: 30px;
        }

        p {
            z-index: 8;
            padding: 0;
            margin-left:30px;
            @include userSelect;
        }

        &_img {
            transform: translateY(3px) rotate(9deg);
            animation: fuwari 4s infinite ease-in-out 0.2s normal;
            transition: 1.5s ease-in-out;
        }
    }

    .overlay {
        z-index: 99;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }

    .post_modal {
        z-index: 100;
        width: 430px;
        min-height: 224px;
        @include subBackGround;
        margin: 220px auto;
        overflow:hidden;
        @include flex;
        justify-content: center;
        flex-direction: column;

        &_header{
            height:26px;
            width: 430px;
            @include flex;
            justify-content: flex-end;
            border-bottom:1px solid var(--modeBorderColor);
            
            .close_button {
                width: 30px;
                height: 26px;
                @include flexCenter;
                @include closeButton;
            }
        }

        &_contents{
            width: 430px;
            @include flex;
            justify-content: center;
            flex-direction: column;

            textarea {
                height: 160px;
                padding: 10px;
                border: none;
                outline: none;
                resize: none;
                @include textColor;
                @include subBackGround;

            }

            @include medhiaPreview;

        }

        & .post_footer{
            width: 430px;
            height: 40px;
            @include flex;
            align-items: center;
            position: relative;
            border-top: 1px solid var(--modeBorderColor);

            & .post_medhia{
                width: 50px;
                height: 26px;
                @include flex;
                justify-content: center;
                position: absolute;
                right: 90px;

                img{
                    &:hover{
                        @include hoverCursor;
                    }   
                }

                #medhia_file{
                    display:none;
                }
            }

            & .post_button {
                width: 50px;
                height: 26px;
                position: absolute;
                right: 10px;
                @include backSelectColor;
                text-align: center;
                line-height: 26px;
                border-radius: 5px;
                font-size: 14px;
                font-weight: bold;
                &:hover{
                    @include hoverCursor;
                    background: #11ec98;
                }
            }
        }
    }

    
    .reply_modal {
        z-index: 100;
        width: 800px;
        @include mainBackground;
        margin: 140px auto 0;
        overflow:hidden;

        &_header{
            width: 100%;
            height: 30px;
            border-bottom:1px solid var(--modeBorderColor);
            position: relative;

            .close_button {
                width: 30px;
                height: 30px;
                position: absolute;
                top: 0;
                right: 0;
                margin-right:6px;
                display:flex;
                justify-content: center;
                align-items: center;

                @include closeButton;
            }
        }

        &_list{
            padding-top: 4px;
            padding-bottom: 2px;
        }

        .blank{
            height:14px;
            @include flexCenter;
            &_content{
                width: 790px;
                height:10px;
                @include backSelectColor;
            }
        }
    }

    .reply_message{
        z-index: 101;
        width: 800px;
        margin: 0 auto 0;
        @include mainBackground;
        overflow:hidden;

        textarea {
            display: block;
            width: 790px;
            height: 34px;
            border: none;
            outline: none;
            resize: none;
            overflow: hidden;
            @include textColor;
            margin: 4px auto;
            padding: 10px;
            @include subBackGround;
            font-size: 16px;
        }

        @include medhiaPreview;


        .reply_footer{
            height: 40px;
            width: 800px;
            border-top: 1px solid var(--modeBorderColor);
            @include flex;
            align-items: center;
            position: relative;

            .reply_medhia{
                width: 28px;
                height: 26px;
                @include flex;
                justify-content: center;
                position: absolute;
                right: 120px;

                img{
                    width: 28px;
                    height: 26px;
                    &:hover{
                        @include hoverCursor;
                    }   
                }

                #medhia_file{
                    display:none;
                }
            }

            .button{
                height:24px;
                width: 50px;
                position: absolute;
                right: 10px;
                @include backSelectColor;
                border-radius: 10px;

                p{
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 24px;
                    text-align: center;
                    color: #000000;
                }

                &:hover{
                    @include hoverCursor;
                    @include hoverColor;
                }
            }
        }
    }

    @keyframes fuwari {
        0% {
            transform:translate(-6px,2px) rotate(9deg);
        }
        33% {
            transform:translate(8px, -2px) rotate(0deg);
        }
        66% {
            transform:translate(20px,5px) rotate(6deg);
        }
        100% {
            transform:translate(-6px,2px) rotate(9deg);
        }
    }

    @keyframes slide {
        0%{
            transform:translateX(0px);
        }
        100%{
            transform:translateX(53px);
        }
    }

    @keyframes scan{
        0%  {
            transform:translateX(-250px);
        }
        86% {
            opacity: 1;
        }
        90% {
            opacity: 0;
        }
        100%{
            transform:translateX(12px);
            opacity: 0;
            
        }
    }

    @keyframes cricle{
        0%{
            opacity: 0;
        }
        30%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }

</style>