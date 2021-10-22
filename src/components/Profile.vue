<template>
    <div class="profile" :style="selectStyle">
        <div class="profile_wrapper">
            <div class="profile_left">
                <div class="profile_left_image">
                    <img :src="user_info[0].userimage_url ? user_info[0].userimage_url : require('@/assets/firsticon.png')" alt="icon">
                </div>
                <p class="user_name">{{ user_info[0].user_name }}</p>
                <p class="user_id">{{ user_info[0].user_id }}</p>
            </div>
            <div class="profile_center">
                <div class="self_introduction">
                    <p>{{ user_info[0].self_introduction }}</p>
                </div>
                <div class="numbers">
                    <div class="post_number">
                        <p>投稿数</p>
                        <p>{{ postCount }}</p>
                    </div>
                    <div class="follow_number">
                        <p>フォロー数</p>
                        <p>{{follow_info.following_count}}</p>
                    </div>
                    <div class="follower_number">
                        <p>フォロワー数</p>
                        <p>{{follow_info.followed_count}}</p>
                    </div>
                </div>
            </div>
            <div class="profile_right">
                <div 
                    class="profile_edit"
                    @click="peModalShow">
                    <p>編集する</p>
                </div>
            </div>
        </div>
        <ul class="tab">
            <li 
                class="tab_item tab1"
                :class="{active: isActive('post')}"
                @click="changeActive('post')">
                <p>投稿</p>
            </li>
            <li 
                class="tab_item tab2"
                :class="{active: isActive('follows')}"
                @click="changeActive('follows')">
                <p>フォロー</p>
            </li>
            <li 
                class="tab_item tab3"
                :class="{active: isActive('followed')}"
                @click="changeActive('followed')">
                <p>フォロワー</p>
            </li>
            <div class="active_bar">
            </div>
        </ul>
        <div class="tab_contents">
            <div 
                class="tab_list"
                v-show="isActive('post')">
                <div
                    v-if="myLists.length>0">
                    <List v-for="list in myLists.slice(0,myListCounter)" :list="list" :key="list.id" />
                    <div 
                        v-if="myLists.length > myListCounter"
                        class="counter">
                        <div
                            @click="addMyListCount()"
                            class="counter_button">
                            <p>さらに投稿を見る</p>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="empty_list">
                    <p>まだ投稿はありません。</p>
                    <p>左メニューから投稿してみましょう。</p>
                </div>
            </div>
            <div 
                class="tab_list"
                v-show="isActive('follows')">
                <div
                    v-if="follow_info.following_list.length>0">
                    <FollowList v-for="list in follow_info.following_list.slice(0,followingListCounter)" :list="list" :key="list.id" />
                    <div 
                        v-if="follow_info.following_list.length > followingListCounter"
                        class="counter">
                        <div
                            @click="addFollowingListCount()"
                            class="counter_button">
                            <p>さらに見る</p>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="empty_list">
                    <p>まだフォローされていません。</p>
                </div>
            </div>
            <div 
                class="tab_list"
                v-show="isActive('followed')">
                <div
                    v-if="follow_info.followed_list.length>0">
                    <FollowList v-for="list in follow_info.followed_list.slice(0,followedListCounter)" :list="list" :key="list.id" />
                    <div 
                        v-if="follow_info.followed_list.length > followedListCounter"
                        class="counter">
                        <div
                            @click="addFollowedListCount()"
                            class="counter_button">
                            <p>さらに見る</p>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="empty_list">
                    <p>まだフォローしていません。</p>
                    <p>検索から気になるユーザーをフォローしてみましょう。</p>
                </div>
            </div>
        </div>
        <!-- profileEdit Modal-->
        <div follow_info
            class="pe_overlay"
            v-show="peModalValue"
            @click.self="peModalShow">
            <div class="pe_modal" :style="selectStyle">
                <div class="close_button" @click="peModalShow();">×</div>
                <div class="profile_icon">
                    <div class="profile_icon_preview">
                        <div 
                            v-if="preViewImage === ''"
                            class="profile_icon_preview_wrapper">
                            <img :src="update_image_files ? update_image_files : require('@/assets/firsticon.png')" alt="icon">
                        </div>
                        <div 
                            v-else
                            class="profile_icon_preview_wrapper">
                            <img :src="preViewImage" alt="icon">
                        </div>
                    </div>
                    <div class="profile_icon_change">
                        <div class="profile_icon_name">
                            <p class="name">{{preViewImagePath}}</p><p class="extension">{{extension_name}}</p>
                        </div>
                        <label class="file_upload_lavel" for="image_file">画像変更<input type="file" id="image_file" accept="image/*" @click= "cacheClear" @change="fileChange"></label>
                    </div>
                </div>
                <form>
                    <input type="text" v-model="update_userId">
                    <input type="text" v-model="update_userName">
                    <textarea
                        type="text"
                        v-model="update_selfIntro">
                    </textarea>
                </form>
                <div
                    class="update">
                    <div 
                        class="update_button"
                        @click="changeProf();peModalShow()">
                        <p>更新する</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import List from "@/components/List";
    import FollowList from "@/components/FollowList";

    export default{
        data() {
            return {
                peModalValue: false, //モーダル表示・非表示値
                extension_name:"", //user画像変更時 拡張子保存
                preViewImage:"", //user画像変更時 プレビュー画像保存
                preViewImagePath: "", //user画像変更時 プレビュー画像パス保存
                update_userId: this.$store.state.users.users[0].user_id, //user ID変更時時 現在のID 呼び出し
                update_userName: this.$store.state.users.users[0].user_name, //user Name変更時 現在の Name 呼び出し
                update_selfIntro: this.$store.state.users.users[0].self_introduction, //user introduction変更時 現在の introduction 呼び出し
                update_image_files: this.$store.state.users.users[0].userimage_url, //user画像確定時 画像データ保存
                activeTab: this.$store.state.profileCurrentTab, //active タブの初期化 呼び出し
                myListCounter : 100, //mylist 表示最大値
                followingListCounter: 100, //following list 表示最大値
                followedListCounter: 100, //followed list 表示最大値

            }
        },

        components: {
            List,
            FollowList,
        },

        methods: {

            //タブとコンテンツの連動判定
            isActive(nextTab){
                return this.activeTab === nextTab;
            },

            //タブの切替
            changeActive(nextTab){
                this.activeTab = nextTab;
            },

            //プロフィール変更モーダル表示・非表示
            //非表示時には変更値のリセット
            peModalShow(){
                this.peModalValue = !this.peModalValue;
                this.preViewImage = ""
                this.preViewImagePath = ""
                this.extension_name = ""
                this.update_image_files = this.$store.state.users.users[0].userimage_url
            },

            //プロフィール変更
            changeProf(){

                //IDと名前が空白じゃない場合 バリデーション
                if(this.update_userName !== "" && this.update_userId !== ""){
                    var update_prof = {
                        name: this.update_userName,
                        newId : this.update_userId,
                        text: this.update_selfIntro,
                        imageUrl: this.update_image_files
                    }

                    console.log(update_prof)
                    this.$store.dispatch('changeUserInfo',update_prof );
                }else{
                    this.update_userName = this.$store.state.users.users[0].user_id
                    this.update_userId = this.$store.state.users.users[0].user_name
                    this.update_selfIntro = this.$store.state.users.users[0].self_introduction
                    this.update_image_files = this.$store.state.users.users[0].userimage_url
                }
            },
            
            //プロフ画像プレビューのキャッシュクリア
            cacheClear(e){
                e.target.value = null; 
            },

            //プロフ画像の変更時 画像データ取得
            fileChange(e){
                this.update_image_files = e.target.files || e.dataTransfer.files;
                if(this.update_image_files[0].type === "image/jpeg" || this.update_image_files[0].type === "image/png"){
                    var splitFileName = this.update_image_files[0].name.split('.')
                    this.preViewImagePath = splitFileName[0]
                    this.extension_name = '.'+ splitFileName[1]
                    this.createPreImage(this.update_image_files[0])
                }else{
                    alert('画像以外を選択しないでください')
                }
            },

            //プロフ画像の変更時 プレビュー画像の作成
            createPreImage(file){
                var reader = new FileReader()
                reader.onload = (e) => {
                    this.preViewImage = e.target.result
                }
                reader.readAsDataURL(file)
            },

            //my list 表示数増加
            addMyListCount(){
                this.myListCounter = this.myListCounter + 50;
            },

            //following list 表示数増加
            addFollowingListCount(){
                this.followingListCounter = this.followingListCounter + 50;
            },

            //followed list 表示数増加
            addFollowedListCount(){
                this.followedListCounter = this.followedListCounter + 50;
            }
        },
        
        computed: {
            //user 情報 呼び出し
            user_info(){
                return this.$store.state.users.users
            },

            //follow情報 呼び出し
            follow_info(){
                return this.$store.state.follows.follows_info
            },

            //my list 呼び出し
            myLists(){
                return this.$store.state.posts.my_list;
            },

            //投稿数 呼び出し
            postCount(){
                return this.$store.state.posts.post_count;
            },

            //select mode color 取得
            selectStyle() {
                return {
                    '--modeMainBackGround':this.$store.state.mode[0].main_color,
                    '--modeSubBackGround':this.$store.state.mode[0].sub_color,
                    '--modeTextColor':this.$store.state.mode[0].text_color,
                    '--modeBorderColor':this.$store.state.mode[0].border_color,
                    '--inputColor': this.$store.state.mode[0].input_color,
                    '--selectColor': this.$store.state.color[0].value,
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

    .profile {
        width: 100%;
        background: var(--modeMainBackGround);

        p {
            color: var(--modeTextColor)
        }

        &_wrapper {
            height: 178px;
            background: var(--modeMainBackGround);
            @include flex;
            border-bottom: 1px solid var(--modeBorderColor);
            position: sticky;
            top:4rem;
            z-index: 9;
        }

        &_left {
            width: 20%;
            margin: auto;
            @include flex;
            flex-direction: column;
            justify-content: center;

            &_image{
                width: 78px;
                height: 78px;
                margin: 0 auto;
                position: relative;
                img {
                    width:100%;
                    height:100%;
                    object-fit: contain;
                    position: absolute;
                    background: #000000;
                    border-radius: 6px;
                }
            }
            .user_name {
                width: 50%;
                margin: 0 auto;
                text-align:left;
            }
            .user_id {
                width: 50%;
                margin: 0 auto;
                text-align: left;
            }
        }
        
        &_center {
            margin: 15px auto;
            width: 55%;
            .self_introduction {
                margin-top: 10px;
                margin-right: 10px;
                margin-left: 10px;
                height: 60%;
            }

            .numbers {
                height: 30%;
                @include flex;
                justify-content: space-around;
                .post_number{
                    text-align: center;
                }

                .follow_number {
                    text-align: center;
                }

                .follower_number {
                    text-align: center;
                }
            }
        }

        &_right {
            width: 25%;
            margin: 30px auto;
            .profile_edit {
                width: 70%;
                margin: 0 auto;
                padding: 6px;
                border-radius: 10px;
                text-align: center;
                background: var(--selectColor);
                &:hover {
                    cursor:pointer;
                    background: #11ec98;
                }

                p {
                    font-size: 14px;
                    font-weight: bold;
                    color: #000000;
                }
            }
        }

        .pe_overlay {
            z-index: 99;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
        }

        .pe_modal {
            z-index: 100;
            width: 430px;
            height: 370px;
            background: var(--modeSubBackGround);
            margin: 180px auto;

            .close_button {
                width: 30px;
                text-align: center;
                margin: 4px 4px 0 auto;
                color: var(--modeTextColor);
                &:hover {
                    cursor: pointer;
                }
            }

            .profile_icon{
                height: 100px;
                width: 430px;
                margin: 0 auto;
                padding-top: 10px;
                @include flex;
                justify-content: space-around;
                align-items: center;

                &_preview{
                    height:100px;
                    width: 120px;
                    @include flex;
                    justify-content: flex-end;
                    align-items:center;

                    &_wrapper{
                        width: 80px;
                        height: 80px;
                        background: #000000;
                        position: relative;
                        border-radius: 6px;

                        img{
                            width:100%;
                            height:100%;
                            object-fit: contain;
                            position: absolute;
                            
                        }
                    }
                }

                &_change{
                    height:100px;
                    width: 310px;
                    @include flexCenter;
                    flex-direction: column;

                    .file_upload_lavel{
                        height: 26px;
                        width: 70px;
                        background: var(--selectColor);
                        border-radius: 10px;
                        margin-top: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                        line-height: 26px;
                        &:hover{
                            cursor: pointer;
                            background: #11ec98;
                        }
                        
                        input{
                            display:none;
                        }
                    }
                }

                &_name{
                    width: 310px;
                    @include flexCenter;
                    .name{
                        max-width: 260px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .extension{
                        max-width: 50px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap; 
                    }
                }
            }

            form{
                width: 400px;
                margin: 0 auto;

                input {
                    width: 100%;
                    height: 30px;
                    margin:0 auto;
                    margin-top:20px;
                    padding: 10px;
                    background: var(--inputColor);
                    color: var(--modeTextColor);
                    border:none;
                    outline:none;
                }

                textarea {
                    width: 100%;
                    height: 80px;
                    margin:0 auto;
                    margin-top: 20px;
                    padding: 10px;
                    background: var(--inputColor);
                    color: var(--modeTextColor);
                    border:none;
                    outline:none;
                    resize: none;
                }
            }

            .update{
                width: 430px;
                height: 30px;
                @include flex;
                align-items: center;
                position:relative;

                &_button{
                width: 70px;
                height: 24px;
                position:absolute;
                right: 14px;
                border-radius: 10px;
                background: var(--selectColor);
                text-align: center;
                &:hover {
                    cursor: pointer;
                    background: rgb(117, 247, 91);
                }
                p{
                    font-size: 14px;
                    line-height:24px;
                    color:#000000;
                    font-weight: bold;
                }
            }
            }
        }

    }

    .tab {
        @include flex;
        height: 40px;
        background: var(--modeMainBackGround);
        border-bottom:1px solid var(--modeBorderColor);
        position: sticky;
        top: calc(4rem + 178px);
        z-index: 9;
        user-select: none;

        &_item{
            height: 30px; 
            width: calc(100%/3);
            list-style: none;
            text-align: center;
            margin: auto;

            p {
                line-height: 30px;
            }

            &:hover{
                cursor: pointer;
            }
        }

        &_contents{
            min-height: calc(100vh - 282px);
            background: var(--modeMainBackGround);

        }

        &_list{
            animation:slide 0.6s ease-in-out;
            padding-top:4px;
            padding-bottom: 2px;

            .counter{
                @include flex;
                justify-content: center;
                padding-top: 3px;
                padding-bottom: 3px;

                &_button{
                    background: var(--selectColor);
                    border-radius: 10px;
                    width: 200px;
                    @include flex;
                    justify-content: center;

                    p{
                        font-size: 14px;
                        color:black;
                        font-weight: bold;
                    }

                    &:hover{
                        cursor: pointer;
                    }
                }
            }

            .empty_list{
                height:calc(100vh - 288px);
                @include flexCenter;
                flex-direction: column;
                p{
                    margin:10px;
                }
            }
        }

        .active_bar {
            position: absolute;
            bottom:0;
            left:15;
            width: 20%;
            height:2px;
            border-radius: 10px;
            background: linear-gradient(70deg, #f79533,  #ef4e7b, #a166ab, #1098ad, #07b39b, #24d350);
        }

        .tab1.active~.active_bar{
            left: 6.7%;
            transition: .3s ease-in-out;
        }
        .tab2.active~.active_bar{
            left: 40%;
            transition: .3s ease-in-out;
        }
        .tab3.active~.active_bar{
            left: 73.3%;
            transition: .3s ease-in-out;
        }
    }

    @keyframes slide{
        0%{
            opacity:0;
        }
        80%{
            opacity:0;
        }
        100%{
            opacity:1;
        }
    }
</style>