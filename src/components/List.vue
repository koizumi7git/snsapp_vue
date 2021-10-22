<template>
    <div class="list" :style="selectStyle">
        <div class="share_name"
            v-if="list.sharing_name !== null">
            <div class="share_name_wrapper">
                <div>
                    <img src="@/assets/share_post.png" alt="share">
                    <p v-if="list.sharing_user_no === userNo">シェアしました</p>
                    <p v-else>{{list.sharing_name}}さんがシェアしました</p>
                </div>
            </div>
        </div>
        <div 
            class="list_wrapper"
            @mouseup.stop
            @click.prevent="detailModalPostOpen('detailPost',list.post_id)">
            <div class="list_icon">
                <div class="list_icon_wrapper">
                    <img 
                        :src="list.userimage_url? list.userimage_url : require('@/assets/firsticon.png')" 
                        alt="icon"
                        @click.stop="detailModalOpen('detailUser',list.user_id,list.user_no)">
                </div>
            </div>
            <div class="list_contents">
                <div class="list_info">
                    <div class="list_user">
                        <p class="list_name">{{ list.user_name }}</p>
                        <p class="list_id">{{ list.user_id }}</p>
                    </div>
                    <div class="list_time">
                        <p>{{ list.created_at }}</p>
                    </div>
                    <div
                        v-if="userNo === list.user_no && detailsList.length === 0" 
                        class="option"
                        @click.stop="changeOptionValue">
                        <img class="menu_img" :src="require('@/assets/'+selectStyle.selectColor+'/postmenu.png')">
                        <div 
                            class="option_menu"
                            v-if="optionValue">
                            <div class="option_menu_close">
                                <div 
                                    class="close_button"
                                    @click.stop="changeOptionValue">
                                    <img 
                                        :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                                        alt="close"
                                        class="close">
                                    <img 
                                        :src="require('@/assets/plus_on.png')" 
                                        alt="close"
                                        class="close_hover"></div>
                                </div>
                            <div class="option_menu_item">
                                <p @click.stop="deletePost(list.post_id)">削除する</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list_message">
                    <div 
                        class="list_text">
                        <p 
                            v-if="list.reply_id && list.reply_id !== list.user_id"
                            class="reply_id"
                            @click.stop="detailModalPostOpen('detailPost',list.replied_postid)">
                            {{ list.reply_id }}さんへの返信
                        </p>
                        <p 
                            v-else-if="list.reply_id && list.reply_id == list.user_id"
                            class="reply_id"
                            @click.stop="detailModalPostOpen('detailPost',list.replied_postid)">
                            自身への返信
                        </p>
                        <div 
                            class="text_contents"
                            :class="{medhia:list.first_medhia_url !== null}">
                            <p v-html="list.text"/>
                        </div>
                    </div>
                    <div 
                        class="list_medhia"
                        @click.stop>
                        <div 
                            v-if="list.first_medhia_url !== null"
                            class="list_medhia_wrapper">
                            <div 
                                v-if="list.first_medhia_name.indexOf('mp4') !== -1"
                                class="video"
                                @click.stop="medhiaModalOpen(list.first_medhia_url)">
                                <img :src="list.thumbnail_url" alt="video_thumbnail" class="video_thumbnail">
                                <img src="@/assets/playback.png" alt="playback" class="playback">
                            </div>
                            <div 
                                v-else
                                class="image">
                                <div
                                    class="medhia_contents"
                                    @click.stop="medhiaModalOpen(list.first_medhia_url)"
                                    :style="{backgroundImage:`url('${list.first_medhia_url}')`}">
                                </div>
                                <div
                                    class="medhia_contents"
                                    v-if="list.second_medhia_url !== null"
                                    @click.stop="medhiaModalOpen(list.second_medhia_url)"
                                    :style="{backgroundImage:`url('${list.second_medhia_url}')`}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list_fotter" @click.stop>
                    <div class="fotter_item">
                        <div @click.stop="replyModalOpen(list)">
                            <div v-if="list.reply_flag === 1">
                                <img src="@/assets/reply_on.png" alt="replyicon">
                            </div>
                            <div v-else>
                                <img src="@/assets/reply.png" alt="replyicon">
                            </div>
                        </div>
                        <div class="count">{{list.reply_count}}</div>
                    </div>
                    <div
                        class="fotter_item">
                        <div @click.stop="shareFlag(list.post_id,list.user_no,list.share_flag)">
                            <div v-if="list.share_flag === 1">
                            <img src="@/assets/share_on2.png" alt="shareicon">
                            </div>
                            <div v-else>
                                <img src="@/assets/share.png" alt="shareicon">
                            </div>
                        </div>
                        <div class="count">{{list.share_count}}</div>
                    </div>
                    <div class="fotter_item">
                        <div @click.stop="favoriteFlag(list.post_id,list.user_no,list.fav_flag)">
                            <div v-if="list.fav_flag === 1">
                                <img src="@/assets/star_on.png" alt="staricon" class="star_motion">
                            </div>
                            <div v-else>
                                <img src="@/assets/star.png" alt="staricon">
                            </div>
                        </div>
                        <div class="count">{{list.favorite_count}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        data(){
            return {
                userNo: this.$store.state.users.users[0].id, //自分のuserナンバー取得
                optionValue: false, //リストのオプションモーダル開閉フラグ
            }
        },

        props: {
            list:{ 
                type: Object,
                required: true,
            },
        },

        methods: {

            //お気に入り追加・取り消し
            favoriteFlag(postId,userNo,favFlag){
                //返信時じゃない場合
                if(this.replyjudgement === 0){
                    var data ={
                        post_id: postId,
                        user_no: userNo,
                        fav_flag:favFlag
                    }
                    this.$store.dispatch('favorites/favorite',data,{ root: true})
                }
            },

            //詳細モーダル開 ユーザー
            detailModalOpen(type,userId,user_no){
                //返信時じゃない場合
                if(this.replyjudgement === 0){
                    //if 自分のプロフィールの場合 
                    if( user_no === this.userNo){
                        this.$store.dispatch('changePage','profile')
                        this.$store.dispatch('details/resetClose')
                    }else{
                        const data = {
                            type: type,
                            id: userId,
                            userNo: user_no
                        }
                        this.$store.dispatch('details/setScrollPosition')
                        this.changeModal(data)
                        scrollTo(0,0)
                    }
                }
            },


            //詳細モーダル開 投稿
            detailModalPostOpen(type,postId){
                //返信時じゃない場合 かつ 投稿詳細じゃない場合
                if(this.replyjudgement === 0 && this.detailsjudgement !== postId){
                    var data ={
                        type:type,
                        id: postId,
                    }
                    this.$store.dispatch('details/setScrollPosition')
                    this.changeModal(data)
                    scrollTo(0,0)
                }
            },

            //返信モーダル開
            replyModalOpen(data){
                //返信時じゃない場合
                if(this.replyjudgement === 0){
                    this.$store.dispatch('posts/setReplyInfo',data)
                }
            },

            //シェア追加・取り消し
            shareFlag(postId,userNo,shareFlag){
                //返信時じゃない場合
                if(this.replyjudgement === 0){
                    var data ={
                        share_id:postId,
                        user_no:userNo,
                        share_flag:shareFlag
                    }
                    this.$store.dispatch('shares/share',data)
                }
            },

            //画像・動画モーダル開
            medhiaModalOpen(data){
                if(this.replyjudgement === 0){
                    this.$store.dispatch('posts/setMedhiaInfo',data)
                }
            },

            //詳細モーダル開
            changeModal(data){
                this.$store.dispatch('details/changemodal',data)
            },

            //オプションメニューの開閉
            changeOptionValue(){
                this.optionValue = !this.optionValue
            },

            //投稿削除
            async deletePost(postId){
                var data ={
                    deletePostId: postId
                }
                await this.$store.dispatch('posts/deletePost',data)
                this.changeOptionValue()
            },
        },

        computed: {
            //詳細モーダルの対象かどうか
            detailsjudgement(){
                return this.$store.state.details.detailsNumber[0]
            },

            //詳細モーダルのデータ取得
            detailsList(){
                return this.$store.state.details.detailsList
            },

            //返信時かどうかのフラグ 取得
            replyjudgement(){
                return this.$store.state.posts.replyedValue.length
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
            },
        },
            
    }
</script>


<style lang="scss" scoped>
    @mixin mainBackGround{
        background: var(--modeMainBackGround);
    }
    @mixin subBackGround{
        background: var(--modeSubBackGround);
    }
    
    @mixin flexCenter{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @mixin selectColor{
        color: var(--selectColor);
    }

    @mixin textColor{
        color: var(--modeTextColor);
    }

    @mixin hoverPointer{
        cursor:pointer;
    }

    .list {
        width: 800px;
        margin-bottom: 2px;
        @include flexCenter;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .share_name{
            height:24px;
            width: 790px;
            @include subBackGround;
            display: flex;
            justify-content: center;
            align-items: center;

            &_wrapper{
                display: inline-block;
                background: var(--selectColor);
                padding:0 10px;
                border-radius: 10px;
                div{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 1;
                    img{
                        width: 14px;
                        height: 14px;
                        margin-right:4px;
                    }
                    p{
                        font-size: 11px;
                    }
                }
            }
        }

        &_wrapper{
            width: 790px;
            display: flex;
            @include subBackGround;
        }

        &_icon {
            width: 60px;
            display: flex;
            justify-content: center;
            
            &_wrapper{
                margin-top: 6px;
                width: 50px;
                height: 50px;

                img {
                    width:100%;
                    height:100%;
                    object-fit: contain;
                    background: #000000;
                    border-radius: 6px;
                }
                
                &:hover{
                    @include hoverPointer;
                }
            }
        }

        &_contents{
            width: 730px;
        }

        &_info {
            display: flex;
            width: 730px;
            position: relative;
            height: 30px;

            .option{
                position: absolute;
                right: 0;
                width: 30px;
                height: 30px;
                @include flexCenter;

                .menu_img{
                    width: 16px;
                    height: 16px;

                    &:hover{
                        @include hoverPointer;
                    }
                }

                &_menu{
                    position: absolute;
                    width: 100px;
                    top:10px;
                    right: 6px;
                    z-index:30;
                    border-radius: 5px;
                    @include mainBackGround;
                    
                    &_close{
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        height: 24px;
                        margin-right:4px;
                        border-bottom:1px solid var(--modeBorderColor);
                        .close_button{
                            height: 16px;
                            width: 16px;
                            .close{
                                width: 16px;
                                height: 16px;
                                margin :auto;
                            }
                            .close_hover{
                                width: 16px;
                                height: 16px;
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
                    }

                    &_item{
                        display: flex;
                        justify-content: center;
                        &:hover{
                            background:var(--selectColor);
                            border-radius: 5px;
                        }
                        p{
                            padding-top: 1px;
                            padding-bottom: 1px;
                            font-size:15px;

                            &:hover{
                                @include hoverPointer;
                            }
                        }
                    }
                }
            }
        }

        &_user {
            height: 30px;
            max-width: 600px;
            margin-left: 4px;
            display: flex;;
        }

        &_name {
            font-size: 18px;
        }

        &_id {
            font-size: 18px;
            margin-left: 4px;
            color:rgb(123, 123, 123);
        }

        &_time {
            position: absolute;
            right: 30px;
            height: 30px;
            width: 144px;
            font-size: 16px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            & p{
                font-size:13px;
            }
        }

        &_message {
            margin: 0;
            min-height: 30px;
            width: 730px;
            display: flex;
        }

        &_text {
            .reply_id{
                font-size: 12px;
                display: inline-block;
                padding-left: 4px;
                @include selectColor;
                &:hover{
                    @include hoverPointer;
                }
            }
            
            .text_contents{
                width: 730px;
                padding-left: 4px;
                padding-right: 4px;
                word-wrap: break-word;
            }

            .text_contents.medhia{
                width: 530px;
            }
        }

        &_medhia {
            width: 200px;
            min-height: 50px;
            border-radius: 6px;
            margin-right: 2px;
            display: flex;


            &_wrapper{
                width: 100%;
                height: 100%;
                display: flex;

                .video{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    margin-right: 2px;
                    position: relative;

                    .video_thumbnail {
                        width: 100%;
                        height: 100%;
                        background: black;
                        border-radius: 6px;
                    }

                    .playback{
                        width: 30px;
                        height: 30px;
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        z-index: 3;
                    }

                    &:after{
                        content:'';
                        z-index: 2;
                        position: absolute;
                        display: block;
                        width: 30px;
                        height: 24px;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        background: black;
                    }

                    &:hover{
                        @include hoverPointer;
                        &:after{
                            content:'';
                            position: absolute;
                            background: var(--selectColor);
                            opacity: 0.5;
                            height:100%;
                            width: 100%;
                            border-radius: 6px;
                        }
                    }
                }

                .image{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    margin-right: 2px;
                    
                    .medhia_contents{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        background-position: center;
                        position: relative;
                        border-radius: 6px;

                        &:hover{
                            @include hoverPointer;
                    
                            &:after{
                                content:'';
                                position: absolute;
                                background: var(--selectColor);
                                opacity: 0.5;
                                height:100%;
                                width: 100%;
                                border-radius: 6px;

                            }
                        }
                    }
                }
            }
                
        }

        &_fotter  {
            height: 30px;
            width: 730px;
            display: flex;

            .fotter_item{
                position: relative;
                width: calc(670px / 3);
                font-size: 5px;
                @include flexCenter;

                img{
                    cursor: pointer;
                    width: 16px;
                    height: 16px;
                }

                .count{
                    @include textColor;
                    width: 40px;
                    position: absolute;
                    right: 60px;
                    font-size: 12px;
                    font-weight: bold;
                }
            }
        }
    }

</style>