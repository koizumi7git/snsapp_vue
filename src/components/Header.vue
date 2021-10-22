<template>
    <header class="header" :style="selectStyle">
        <div class="header_title">
            <h1 class="header_title_h1">SNSアプリ(仮)</h1>
        </div>
        <div 
            class="header_contents"
            :style="loadingValue === 'login'? 'visibility: visible' : 'visibility: hidden'">
            <div class="user">
                <div 
                    class="user_icon"
                    v-if="userInfo">
                    <img :src="userInfo.userimage_url? userInfo.userimage_url :require('@/assets/firsticon.png')" alt="usericon">
                </div>
            </div>
            <div class="reload">    
                <div 
                    class="reload_button"
                    @click.prevent="allReload()">
                    <img class="reload_stanby" :src="require('@/assets/'+selectStyle.selectColor+'/reload.png')" alt="reload">
                    <img class="reload_on" :src="require('@/assets/load_on.png')" alt="reload">
                </div>
            </div>
        </div>
        <div 
            class="button"
            v-if="activeUser()">
            <div 
                class="button_content"
                v-show="isActive('login')"
                @click.prevent="changePage('signup')">Signup</div>
            <div 
                class="button_content"
                v-show="isActive('signup') || isActive('userinfosignup')"
                @click.prevent="changePage('login')">Login</div>
        </div>
        <div 
            class="button"
            v-else>
            <div 
                class="button_content"
                @click.prevent="logOut()">
                Logout
            </div>
        </div>
    </header>
</template>

<script>
export default {

    methods: {
        //ユーザーがログイン済みかどうか
        activeUser(){
            return this.userStatus === null
        },

        //ログイン サインアップの表示フラグ
        isActive(page){
            return this.currentSelect === page
        },
        
        //ログイン・サインアップボタンクリック時、ページ表示切替
        changePage(page){
            this.$store.dispatch('changeLoginSignupPage',page)
        },

        //更新ボタンクリック リスト再取得
        allReload(){
            this.$store.dispatch('allReload')
        },

        //ログアウト
        logOut(){
            this.$store.dispatch('userLogout')
        },
    },

    computed: {
        //現在ログイン済みかどうか取得
        userStatus(){
            return this.$store.state.users.uid
        },

        //ユーザーの情報取得 名前ID等
        userInfo(){
            return this.$store.state.users.users[0]
        },

        //現在表示するページ取得
        currentSelect(){
            return this.$store.state.loginSinupPageSelect
        },

        //ログインの有無でヘッダーのユーザー情報を表示するためのフラグ取得
        loadingValue(){
            return this.$store.state.loadingState
        },

        //select mode color 取得
        selectStyle() {
            return {
                '--modeMainBackGround':this.$store.state.mode[0].main_color,
                '--modeTextColor':this.$store.state.mode[0].text_color,
                '--modeBorderColor':this.$store.state.mode[0].border_color,
                '--selectColor': this.$store.state.color[0].value,
                'selectColor': this.$store.state.color[0].value,
            }
        }
    }
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

    .header{
        position: fixed;
        top: 0;
        height: 4rem;
        width: 100%;
        border-bottom:1px solid var(--modeBorderColor);
        z-index: 999;
        @include flex;
        align-items: center;
        background: var(--modeMainBackGround);

        &_title {
            width: 256px;
            height: 4rem;
            @include flexCenter;

            &_h1{
                font-size: 1.4rem;
                color: var(--modeTextColor);
                user-select: none;
            }
        }

        &_contents {
            @include flex;
            height:4rem;
            width: 700px;

            .user{
                min-width: 70px;
                @include flexCenter;
                &_icon{
                    width: 50px;
                    height: 50px;
                    @include flexCenter;
                    border-radius: 6px;

                    &:hover{
                        cursor: pointer;
                    }
                    
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        background: #000000;
                        border-radius: 6px;
                    }

                }
            }

            .reload{
                width: 630px;
                height: 4rem;
                @include flex;
                justify-content: flex-end;
                align-items: center;

                &_button{
                    margin-right:50px;
                    width: 30px;
                    height: 30px;
                    @include flexCenter;

                    &:hover{
                        cursor: pointer;

                        .reload_stanby{
                            display: none;
                        }

                        .reload_on{
                            display:inline;
                            animation: rotate 4s linear infinite;
                        }
                    }

                    .reload_stanby{
                        width: 100%;
                        height: 100%;
                    }

                    .reload_on{
                        width: 100%;
                        height: 100%;
                        display: none;
                    }
                }
            }
        }

        .button{
            width: 100px;
            height: 4rem;
            @include flexCenter;

            &_content {
                width: 80px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-radius: 10px;
                color: #000000;
                font-weight: bold;
                background: var(--selectColor);
                &:hover {
                    cursor: pointer;
                    background: #11ec98;
                }
            }
        }
    }

    @keyframes rotate {
        0%{
            transform: rotate(0deg)
        }
        100%{
            transform: rotate(-360deg)
        }
        
    }

</style>