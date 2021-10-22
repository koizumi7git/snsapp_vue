<template>
    <div 
        class="content"
        v-if="loadingValue === 'standby'">
        <div class="left_block">
            <div class="left_block_text">
                <h1>SNSアプリ(仮)</h1>
                <h1>はじめてみよう</h1>
            </div>
        </div>
        <div class="right_block">
            <div 
                class="initial"
                v-show="changePage('initial')">
                <div>
                    <div
                        class="login_button"
                        @click.prevent="pageParam('login')">Login</div>
                </div>
                <div>
                    <div
                        class="signup_button"
                        @click.prevent="pageParam('signup')">Signup</div>
                </div>
            </div>
            <div 
                class="form"
                v-show="changePage('login')">
                <form
                    class="form_contents" >
                    <div class="email">
                        <small>{{ loginEmailMsg }}</small>
                        <div class="email_content">
                            <label>メールアドレス：</label>
                            <input type="text" v-model="loginform.loginEmail" @focus="loginEmailCheck()"/>
                        </div>
                    </div>
                    <div class="password">
                        <small>{{ loginPassMsg }}</small>
                        <div class="password_content">
                            <label>パスワード：</label>
                            <input type="password" v-model="loginform.loginPassword" @focus="loginPassCheck()"/>
                        </div>
                    </div>
                    <div class="button">
                        <div
                            class="button_contents"
                            @click.prevent="login">Login</div>
                    </div>
                </form>
            </div>
            <div 
                class="form"
                v-show="changePage('signup')">
                <form 
                    class="form_contents">
                    <div class="email">
                        <small>{{ signEmailMsg }}</small>
                        <div class="email_content">
                            <label>メールアドレス：</label>
                            <input 
                                type="text" 
                                v-model="signupform.signupEmail" 
                                @blur="emailValidation(signupform.signupEmail)"/>
                        </div>
                    </div>
                    <div class="password">
                        <small>{{ signPassMsg }}</small>
                        <div class="password_content">
                            <label>パスワード：</label>
                            <input 
                                type="password" 
                                v-model="signupform.signupPassword"
                                @blur="passwordValidation(signupform.signupPassword)"/>    
                        </div>
                    </div>
                    <div class="button">
                        <div
                            class="button_contents"
                            @click.prevent="pageParam('signupUserInfo')">Signup Next</div>
                    </div>
                </form>
            </div>
            <div
                class="form"
                v-show="changePage('signupUserInfo')">
                <form
                    class="form_user_contents">
                    <div class="user_id">
                        <small>{{ userInfoIdMsg }}</small>
                        <div class="user_id_content">
                            <label>ユーザーID：@</label>
                            <input 
                                type="text" 
                                v-model="userinfoform.userId"
                                @blur="userIdValidation(userinfoform.userId)">   
                        </div>
                    </div>
                    <div class="user_name">
                        <small>{{ userInfoNameMsg }}</small>
                        <div class="user_name_content">
                            <label>ユーザー名：</label>
                            <input 
                                type="text" 
                                v-model="userinfoform.userName"
                                @blur="userNameValidation(userinfoform.userName)">
                        </div>
                    </div>
                    <div class="user_introduction">
                        <label>自己紹介：</label>
                        <textarea type="text" v-model="userinfoform.selfIntroduction"></textarea>
                    </div>
                    <div
                        class="button">
                        <div
                            class="button_contents"
                            @click.prevent="signup">Signup</div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div 
        class="loading"
        v-else>
        <FirstLoading/>
    </div>
</template>

<script>
import firebase from "firebase"
import axios from 'axios'
import router from '../router' 
import FirstLoading from "@/components/FirstLoading";

export default {
    data() {
        return {
            //ログインフォーム値
            loginform: {
                loginEmail: '',
                loginPassword: '',
            },

            //登録フォーム値
            signupform: {
                signupEmail: '',
                signupPassword: '',
            },

            //登録ユーザー情報値
            userinfoform: {
                userId:'',
                userName:'',
                selfIntroduction:'',
            },

            //ログイン時エラーメッセージ
            loginEmailMsg: '',
            loginPassMsg: '',

            //登録時エラーメッセージ
            signEmailMsg: '',
            signPassMsg:'',

            //登録時 値のバリデーションフラグ
            signEmailValid: false,
            signPassValid: false,

            //登録時ユーザー情報 エラーメッセージ
            userInfoIdMsg: '',
            userInfoNameMsg: '',

            //ユーザー情報バリデーションフラグ
            userInfoIdValid: false,
            userInfoNameValid: false,
            
        };
    },

    components:{
        FirstLoading
    },

    methods: {

        //ページ遷移のための値変更
        pageParam(nextPage){
            
            //signup時 メールアドレス&パスワード 完了チェック
            if(nextPage === 'signupUserInfo'){

                //登録メールアドレス、登録パスワード空白時
                if(this.signupform.signupEmail === '' && this.signupform.signupPassword === ''){

                    this.signEmailMsg = "※入力してください"
                    this.signPassMsg = "※入力してください"

                //メールアドレスのみ空白
                }else if(this.signupform.signupEmail === ''){

                    this.signEmailMsg = "※入力してください"

                //パスワードのみ空白
                }else if(this.signupform.signupPassword === ''){

                    this.signPassMsg = "※入力してください"
                
                //両方空白ではない場合
                }else{

                    //登録バリデーションチェックが完了している場合
                    if(this.signEmailValid && this.signPassValid){

                        //次の頁移動の値格納
                        this.$store.dispatch('changeLoginSignupPage', nextPage)
                    }
                }

            }else{
                //次の頁移動の値格納
                this.$store.dispatch('changeLoginSignupPage', nextPage)
            }
        },

        //ページ遷移 
        changePage(currentPage){
            return this.currentSelect === currentPage
        },

        //ログイン
        async login() {

            //ロード画面の表示文字格納
            this.$store.dispatch('loadingWord','ログイン情報取得中...')

            //firebaseログイン認証
            await this.$store.dispatch('userLogin', this.loginform)

        },

        //ログイン メールアドレス エラーメッセージ解除
        loginEmailCheck(){
            this.loginEmailMsg = ""
        },

        //ログイン パスワード エラーメッセージ解除
        loginPassCheck(){
            this.loginPassMsg = ""
        },
        
        //新規登録
        async signup() {
            this.$store.dispatch('loadingValue','usersignup')
            //全てのバリデーションチェック完了
            if(this.signEmailValid && this.signPassValid && this.userInfoIdValid && this.userInfoNameValid){
                const signupData ={

                    signup: this.signupform,
                }

                const userinfoData={

                    user_id: '@' + this.userinfoform.userId,
                    user_name: this.userinfoform.userName,
                    self_introduction: this.userinfoform.selfIntroduction,
                    auth_id: ''
                }

                //自己紹介は空白でも可
                if(userinfoData.self_introduction === ""){
                    userinfoData.self_introduction = null
                }
                
                await this.$store.dispatch('userSignup', signupData)
                await this.$store.dispatch('signupUserInfo',userinfoData)
            }
        },

        //signup メールアドレスバリデーション
        emailValidation(email){
            firebase.auth().fetchSignInMethodsForEmail(email).then((result) => {
                if (result.length === 1) {
                    this.signEmailMsg = "※そのメールアドレスは登録されています"
                    this.signEmailValid = false
                } else {
                        this.signEmailMsg = "ok!"
                        this.signEmailValid = true
                }
            }).catch(() => {

                if(email === ""){
                    this.signEmailMsg = "※入力してください"
                    this.signEmailValid = false
                }else{
                    this.signEmailMsg = "※正しい形式で入力してください"
                    this.signEmailValid = false
                }
            })
        },

        //signup パスワードバリデーション
        passwordValidation(pass){

            if(pass === ''){
                this.signPassMsg = "※入力してください"
                this.signPassValid = false
            }else if(pass.length < 6){
                this.signPassMsg = "※6文字以上入力してください"
                this.signPassValid = false
            }else{
                this.signPassMsg = "ok!"
                this.signPassValid = true
            }

        },

        //userId バリデーション
        userIdValidation(id){

            if(id === ''){
                this.userInfoIdMsg = '※入力してください'
                this.userInfoIdValid = false
            }else if (id.length < 5){
                this.userInfoIdMsg = '※5文字以上入力してください'
                this.userInfoIdValid = false
            }else{
                const data = {
                id: '@' + id
                }
                axios.get('http://127.0.0.1:8000/api/user_check',{ params: data }).then((res) => {
                    if(res.data.length){
                        this.userInfoIdMsg = '※このIDは既に使われています'
                        this.userInfoIdValid = false
                    }else{
                        this.userInfoIdMsg = 'ok!'
                        this.userInfoIdValid = true
                    }
                }).catch(error => {
                    alert(error)
                })
            }
        },

        //userName バリデーション
        userNameValidation(name){
            if(name === ''){
                this.userInfoNameMsg = '※入力してください'
                this.userInfoNameValid = false
            }else{
                this.userInfoNameMsg = 'ok!'
                this.userInfoNameValid = true
            }
        },

    },

    computed: {
        //ロード画面の状態
        loadingValue(){
            return this.$store.state.loadingState
        },

        //現在のページstatus
        currentSelect(){
            return this.$store.state.loginSinupPageSelect
        },

        //ログイン・サインアップチェック
        userCheck(){
            return this.$store.state.users.userState
        },

        //firebase ログインエラー取得
        loginError(){
            return this.$store.state.users.loginError
        },

        //ユーザー情報チェック
        userInfoCheck(){
            return this.$store.state.users.users[0]
        },

        //ユーザーモードチェック
        userModeCheck(){
            return this.$store.state.mode[0]
        },

        //ユーザーカラーチェック
        userColorCheck(){
            return this.$store.state.color[0]
        }
    }, 
    
    //監視 登録input、 ログイン等
    watch: {

        //firebase ログインエラー
        'loginError':function(val){
            //それぞれのエラー時対応
            if(val === 'auth/wrong-password'){

                this.loginPassMsg = 'パスワードが間違っています'

            }else if(val === 'auth/user-not-found'){

                this.loginEmailMsg = 'そのメールアドレスはユーザー登録されていません'

            }else if(val === 'auth/invalid-email'){
                this.loginEmailMsg = 'メールアドレスを正しい形式で入力してください'

            //firebase ログイン成功時
            }else if(val === 'success'){
                //firebase認証成功時、ローディング画面へ移動のための値格納
                this.$store.dispatch('loadingValue','userlogin')
                return
            }
            //ロード画面の文章変更
            this.$store.dispatch('loadingWord','Loading...')
        
        },

        //登録メールアドレス
        'signupform.signupEmail': function(val) {
            if(val === ''){
                this.signEmailMsg = '※入力してください'
            }else{
                this.signEmailMsg = 'checking...'
            }
        },

        //登録パスワード
        'signupform.signupPassword': function(val){
            if(val === ''){
                this.signPassMsg = '※入力してください'
            }else{
                this.signPassMsg = 'checking...'
            }
        },

        //登録ユーザーID
        'userinfoform.userId': function(val){
            if(val === ''){
                this.userInfoIdMsg = '※入力してください'
            }else{
                this.userInfoIdMsg = 'checking...'
            }
        },

        //登録ユーザー名
        'userinfoform.userName': function(val){
            if(val === ''){
                this.userInfoNameMsg = '※入力してください'
            }else{
                this.userInfoNameMsg = 'checking...'
            }
        },

        /*   ログイン・サインアップ時   */
        //ログイン取得、サインアップできたかどうか
        'userCheck': function(val){
            if(val === 'login'){
                this.$store.dispatch('loadingPercent',30)

                this.$store.dispatch('loadingWord','ユーザー情報取得中...')
                this.$store.dispatch('getUserInfo','login')
                
            }else if(val === 'signupFirebase'){
                this.$store.dispatch('loadingPercent',10)
                this.$store.dispatch('loadingWord','メール・パスワード登録中...')

            }else if(val === 'signupFirebaseComplete'){
                this.$store.dispatch('loadingWord','メール・パスワード登録完了')

            }else if(val === 'signupUserInfo'){
                this.$store.dispatch('loadingPercent',20)
                this.$store.dispatch('loadingWord','ユーザー情報登録中...')

            }else if(val ==='signup'){

                this.$store.dispatch('loadingPercent',30)
                this.$store.dispatch('loadingWord','ユーザー情報登録完了')
                this.$store.dispatch('getUserInfo','login')
            }

        },

        //ユーザー情報を取得できたかどうか
        'userInfoCheck': function(){
            if(this.userCheck === 'login'){
                this.$store.dispatch('loadingPercent',60)

                this.$store.dispatch('loadingWord','モード情報取得中...')
                this.$store.dispatch('setMode','login')
                
            }else if(this.userCheck === 'signup'){
                this.$store.dispatch('loadingPercent',40)
                this.$store.dispatch('follows/signupFollow',{ root: true })
                this.$store.dispatch('setMode','login')
            }
        },

        //モード情報を取得できたかどうか
        'userModeCheck': function(){
            if(this.userCheck === 'login'|| this.userCheck ==='signup'){
                this.$store.dispatch('loadingPercent',80)
                
                this.$store.dispatch('loadingWord','カラー情報取得中...')
                this.$store.dispatch('setColor','login')
                
            }
        },

        //カラー情報を取得できたかどうか (ログイン情報を全て取得完了)
        'userColorCheck': function(){
            if(this.userCheck === 'login'|| this.userCheck ==='signup'){
                this.$store.dispatch('loadingPercent',100)
                this.$store.dispatch('loadingWord','データ反映中...')
                this.$store.dispatch('loadingValue','complete')
        
                    
                const transition = () =>{
                    router.push('/')
                }
                
                setTimeout(transition,2000)
            }
        }
        /*   ログイン時ここまで   */
    }
};
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

    @mixin hover{
        &:hover {
            cursor: pointer;
            background: #11ec98;
        }
    }

    @mixin buttonColor{
        background: rgb(255, 166, 0);
    }

    @mixin errorTextColor{
        color: #ff0000;
    }

    @mixin commonHeight{
        height: calc(100vh - 4rem);
    }

    .content {
        width: 100%;
        height: 100%;
        position:fixed;
        top: 4rem;
        @include flex;
    }

    .loading{
        width: 100%;
        height: 100%;
        @include commonHeight;
        @include flexCenter;
    }

    .left_block {
        width: 50%;
        @include commonHeight;
        background: #1f1f1f;;

        &_text {
            width: 70%;
            @include commonHeight;
            margin: 0 auto;
            @include flexCenter;
            flex-direction: column;
            h1{
                font-size: 43px;
                color: #ffffff;
            }
        }
    }

    .right_block {
        width: 50%;
        @include commonHeight;
        background: #1f1f1f;

        .login {
            width: 70%;
            margin: 0 auto;
        }

        .signup {
            width: 70%;
            margin: 0 auto;
        }
    }

    .initial {
        width: 100%;
        @include commonHeight;
        @include flexCenter;
        flex-direction: column;
        .login_button {
            width: 250px;
            height: 2.6rem;
            line-height: 2.6rem;
            margin: 0 auto;
            margin-bottom: 20px;
            @include buttonColor;
            border-radius: 20px;
            text-align: center;
            font-weight: bold;
            @include hover;
        }

        .signup_button {
            width: 250px;
            height: 2.6rem;
            line-height: 2.6rem;
            margin: 0 auto;
            margin-top: 20px;
            @include buttonColor;
            border-radius: 20px;
            text-align: center;
            font-weight: bold;
            @include hover;
        }
    }

    .form { 
        width: 100%;
        @include commonHeight;
        @include flexCenter;

        &_contents {
            width: 400px;
            height: 200px;
            margin-right:140px;
            @include flex;
            justify-content: space-around;
            flex-direction: column;
            .email {
                @include flex;
                flex-direction: column;
                margin-right: 32px;
                position:relative;
                small {
                    position: absolute;
                    z-index: 99;
                    right:0;
                    top: -20px;
                    text-align: right;
                    @include errorTextColor;
                }

                &_content{
                    @include flex;
                    justify-content: flex-end;
                }

            }

            .password {
                @include flex;
                flex-direction: column;
                margin-right: 32px;
                position:relative;
                small {
                    position: absolute;
                    z-index: 99;
                    right:0;
                    top: -20px;
                    text-align: right;
                    @include errorTextColor;
                }
                &_content{
                    @include flex;
                    justify-content: flex-end;
                }
            }

            input {
                width: 200px;
                outline:none;
                padding: 0 5px;
            }

            label{
                color: #ffffff;
                font-weight: bold;
            }
        }

        &_user_contents {
            width: 400px;
            height: 300px;
            @include flex;
            justify-content: space-around;
            flex-direction: column;

            .user_id {
                @include flex;
                justify-content: flex-end;
                margin-right: 50px;
                position:relative;
                small {
                    position: absolute;
                    z-index: 99;
                    right:0;
                    top: -20px;
                    text-align: right;
                    @include errorTextColor;
                }
            }

            .user_name{
                @include flex;
                justify-content: flex-end;
                margin-right: 50px;
                position:relative;
                small {
                    position: absolute;
                    z-index: 99;
                    right:0;
                    top: -20px;
                    text-align: right;
                    @include errorTextColor;
                }
            }

            .user_introduction{
                @include flex;
                justify-content: flex-end;
                margin-right: 50px;
            }

            input {
                width: 200px;
                outline:none;
                padding: 0 5px;
            }

            label{
                color: #ffffff;
                font-weight: bold;
            }

            textarea{
                width: 200px;
                height: 60px;
                border:none;
                outline:none;
                resize: none;
                padding: 5px 5px;
            }
        }

        .button {
            @include flex;
            justify-content: center; 
            &_contents {
                height: 36px;
                line-height: 36px;
                text-align: center;
                font-weight: bold;
                width: 140px;
                @include buttonColor;
                border-radius: 20px;
                @include hover;
            }

        }
    }


</style>