<template>
    <div class="setting" :style="selectStyle">
        <div class="setting_header">
            <img :src="require('@/assets/'+selectStyle.selectColor+'/setting.png')" >
            <p>設定</p>
        </div>
        <div class="setting_contents">
            <div class="setting_contents_account">
                <div class="setting_sub_header">
                    <p>アカウント</p>
                </div>
                <div class="setting_contents_wrapper">
                    <div class="setting_title">
                        <p>メールアドレス</p>
                    </div>
                    <div class="setting_value">
                        {{currentEmail}}
                    </div>
                    <div 
                        class="setting_button"
                        @click.prevent="modalShow();changeModalSelctValue('email')">
                        変更
                    </div>
                </div>
                <div class="setting_contents_wrapper">
                    <div class="setting_title">
                        <p>パスワード</p>
                    </div>
                    <div class="setting_value_pass">
                        ********
                    </div>
                    <div 
                        class="setting_button"
                        @click.prevent="modalShow();changeModalSelctValue('password')">
                        変更
                    </div>
                </div>
                <div class="setting_contents_wrapper">
                    <div class="setting_title">
                        <p>アカウント削除</p>
                    </div>
                    <div 
                        class="setting_button"
                        @click.prevent="modalShow();changeModalSelctValue('delete')">
                        削除
                    </div>
                </div>
            </div>
            <div class="setting_contents_app">
                <div class="setting_sub_header">
                    <p>アプリ</p>
                </div>
                <div class="setting_contents_wrapper">
                    <div class="setting_title">
                        <p>モード</p>
                    </div>
                    <div class="setting_value_mode">
                        <div>
                            <p>{{ selectStyle.currentModeType }}</p>
                        </div>
                    </div>
                    <div
                        class="setting_button"
                        @click.prevent="modalShow();changeModalSelctValue('mode')">
                        変更
                    </div>
                </div>
                <div class="setting_contents_wrapper">
                    <div class="setting_title">
                        <p>カラー</p>
                    </div>
                    <div class="setting_value_color">
                        <p>{{ selectStyle.currentColorType }}</p>
                    </div>
                    <div 
                        class="setting_button"
                        @click.prevent="modalShow();changeModalSelctValue('color')">
                        変更
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- modal -->
    <div 
        class="overlay"
        v-show="modalValue"
        :style="selectStyle"
        @click.self="modalShow();resetAllValue()">
        <div 
            class="email_modal"
            v-show="modalSelectShow('email')">
            <div class="close_button" @click.prevent="modalShow();resetEmailValue()">
                <img 
                    :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                    alt="close"
                    class="close">
                <img 
                    :src="require('@/assets/plus_on.png')" 
                    alt="close"
                    class="close_hover">
            </div>
            <div class="title">
                <p>メールアドレス変更</p>
            </div>
            <form>
                <small>{{ emailValidMsg }}</small>
                <input 
                    type="text"
                    v-model="email"
                    @blur="nullEmailCheck(email)"
                    class="email">
                <div class="atto"><p>@</p></div>
                <input 
                    type="text"
                    v-model="emaildomain"
                    @blur="nullEmailCheck(emaildomain)"
                    class="domain">
            </form>
            <div 
                class="button"
                @click.prevent="changeEmail">
                変更
            </div>
        </div>
        <div 
            class="password_modal"
            v-show="modalSelectShow('password')">
            <div class="close_button" @click.prevent="modalShow();resetPasswordValue()">
                <img 
                    :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                    alt="close"
                    class="close">
                <img 
                    :src="require('@/assets/plus_on.png')" 
                    alt="close"
                    class="close_hover">
            </div>
            <div class="title">
                <p>パスワード変更</p>
            </div>
            <form>
                <div class="new_pass">
                    <small> {{ newPassValidMsg }} </small>
                    <label>新規：</label>
                    <input 
                        type="password"
                        class="nuw_pass_val"
                        v-model="newPassword"
                        @blur="newPasswordCheck(newPassword)"> 
                </div>
                <div class="conf_pass">
                    <small> {{ confPassValidMsg }} </small>
                    <label>確認：</label>
                    <input 
                        type="password"
                        class="conf_pass_val"
                        v-model="confPassword"
                        @blur="confPasswordCheck(confPassword)">
                </div>
            </form>
            <div 
                class="button"
                @click.prevent="changePassword">
                変更
            </div>
        </div>
        <div 
            class="delete_modal"
            v-show="modalSelectShow('delete')">
            <div class="close_button" @click.prevent="modalShow()">
                <img 
                    :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                    alt="close"
                    class="close">
                <img 
                    :src="require('@/assets/plus_on.png')" 
                    alt="close"
                    class="close_hover">
            </div>
            <div class="title">
                <p>アカウント削除</p>
            </div>
            <div class="delete_modal_text">
                <p>※本当に削除してもよろしいですか？</p>
            </div>
            <div class="delete_judge_button">
                <div class="button_wrapper">
                    <div 
                        class="button"
                        @click.prevent="deleteUser()">はい</div>
                </div>
                <div class="button_wrapper">
                    <div 
                        class="button"
                        @click.prevent="modalShow()">いいえ</div>
                </div>
            </div>
        </div>
        <div 
            class="mode_modal"
            v-show="modalSelectShow('mode')">
            <div class="close_button" @click.prevent="modalShow();resetModeValue()">
                <img 
                    :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                    alt="close"
                    class="close">
                <img 
                    :src="require('@/assets/plus_on.png')" 
                    alt="close"
                    class="close_hover">
            </div>
            <div class="title">
                <p>モード変更</p>
            </div>
            <form>
                <div class="mode_dark">
                    <input 
                        type="radio" id="dark" value="dark" 
                        v-model="selectStyle.modeType" 
                        @change="tempModeChange(selectStyle.modeType)">
                    <label for="dark">：ダーク</label>
                </div>
                <div class="mode_light">
                    <input 
                        type="radio" id="light" value="light" 
                        v-model="selectStyle.modeType" 
                        @change="tempModeChange(selectStyle.modeType)">
                    <label for="light">：ライト</label>
                </div>
            </form>
            <div 
                class="button"
                @click.prevent="changeMode(selectStyle.modeType)">
                変更
            </div>
        </div>
        <div 
            class="color_modal"
            v-show="modalSelectShow('color')">
            <div class="close_button" @click.prevent="modalShow();resetColorValue()">
                <img 
                    :src="require('@/assets/'+selectStyle.selectColor+'/plus.png')" 
                    alt="close"
                    class="close">
                <img 
                    :src="require('@/assets/plus_on.png')" 
                    alt="close"
                    class="close_hover">
            </div>
            <div class="title">
                <p>カラー変更</p>
            </div>
            <div class="select">
                <select v-model="selectStyle.colorType" @change="tempColorChange(selectStyle.colorType)">
                    <option value="firebrick">firebrick #b22222</option>
                    <option value="dodgerblue">dodgerblue #1e90ff</option>
                    <option value="mediumslateblue">mediumslateblue #7b68ee</option>
                    <option value="gold">gold #ffd700</option>
                    <option value="lemonchiffon">lemonchiffon #fffacd</option>
                    <option value="darkorange">darkorange #ff8c00</option>
                    <option value="hotpink">hotpink #ff69b4</option>
                    <option value="peachpuff">peachpuff #ffdab9</option>
                    <option value="darkkhaki">darkkhaki #bdb76b</option>
                    <option value="lightpink">lightpink #ffb6c1</option>
                    <option value="mediumorchid">mediumorchid #ba55d3</option>
                    <option value="plum">plum #dda0dd</option>
                </select>
            </div>
            <div 
                class="button"
                @click.prevent="changeColor(selectStyle.colorType)">
                変更
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from "firebase"
    export default {
        data() {
            return {
                //モーダル開閉
                modalValue: false,

                //モーダル表示内容
                modalSelectValue:'',

                //現在のメールアドレス
                currentEmail:'',

                //メールアドレス変更に関する値
                email: '',
                emaildomain: '',
                emailValidMsg: '',

                //パスワード変更に関する値
                newPassword: '',
                confPassword: '',
                newPassValidMsg: '8文字以上で設定してください',
                confPassValidMsg: '',
                newPassValidFlag: false,
                confPassValidFlag: false,
                colorPicked:'orange',
            }
        },

        methods:{
            //モーダル閉  メールアドレス関係の値リセット
            resetEmailValue(){
                this.email = ""
                this.emaildomain = ""
                this.emailValidMsg = ""
            },

            //モーダル閉 パスワード関係の値リセット
            resetPasswordValue(){
                this.newPassword = ""
                this.confPassword = ""
                this.newPassValidMsg = "8文字以上で設定してください"
                this.confPassValidMsg = ""
                this.newPassValidFlag = false
                this.confPassValidFlag = false
            },

            //モードリセット
            resetModeValue(){
                this.$store.dispatch('setMode')
            },

            //カラーリセット
            resetColorValue(){
                this.$store.dispatch('setColor')
            },

            //モーダル閉じる 値リセット
            resetAllValue(){
                this.resetEmailValue()
                this.resetPasswordValue()

                //一時的なモード変更を選択していた場合 値リセット
                if(this.modeLength > 1){
                    this.resetModeValue()
                }
                //一時的なカラー変更を選択していた場合 値リセット
                if(this.colorLength > 1){
                    this.resetColorValue()
                }
            },

            //モーダル開 対応している値に変更
            changeModalSelctValue(val){
                this.modalSelectValue = val
            },

            //モーダル開
            modalShow(){
                this.modalValue = !this.modalValue
            },

            //モーダル開 対応している項目画面表示
            modalSelectShow(val){
                return this.modalSelectValue === val
            },

            //メールアドレス 空白チェック
            nullEmailCheck(val){
                if(val === ''){
                    this.emailValidMsg = '※入力して下さい'
                } else {
                    this.emailValidMsg = ''
                }
            },

            //メールアドレス変更
            async changeEmail(){
                
                var newEmail = this.email + '@' + this.emaildomain

                var judge = this.$store.dispatch('changeEmail',newEmail)

                if(judge){
                    console.log(judge)
                    console.log('メールアドレス変更完了')
                    this.currentEmail = newEmail
                    this.resetEmailValue()
                    this.modalShow()
                }
            },

            //新しいパスワードチェック
            newPasswordCheck(val){
                if(val === "") {
                    this.newPassValidMsg ="※入力してください"
                    this.newPassValidFlag = false
                } else if(val.length < 8){
                    this.newPassValidMsg ="※8文字以上入力してください"
                    this.newPassValidFlag = false
                } else {
                    this.newPassValidMsg = "ok!"
                    this.newPassValidFlag = true
                }
            },

            //パスワード変更時 確認チェック
            confPasswordCheck(val){

                if(this.newPassValidFlag) {
                    if(val === ""){
                        this.confPassValidMsg = "※入力してください"
                        this.confPassValidFlag = false
                    } else {
                        if(val === this.newPassword){
                            this.confPassValidMsg = "ok!"
                            this.confPassValidFlag = true
                        }else{
                            this.confPassValidMsg = "※一致しません"
                            this.confPassValidFlag = false
                        }
                    }
                }else{
                    this.confPassValidMsg = "※新規パスワードを先に入力してください"
                    this.confPassValidFlag = false
                }

            },

            //パスワード変更
            async changePassword(){
                //バリデーションチェック完了時
                if(this.newPassValidFlag && this.confPassValidFlag ){
                    var judge = this.$store.dispatch('changePassword',this.newPassword)
                    if(judge){
                        this.modalShow()
                    }
                }else{
                    alert('パスワードを正しく設定・入力してください')
                }
            },

            //ユーザー削除
            async deleteUser(){
                await this.$store.dispatch('deleteUser')
            },

            //current email取得
            getEmail(){
                this.currentEmail = firebase.auth().currentUser.email
            },

            //一時できなモード変更
            tempModeChange(val){
                this.$store.dispatch('tempModeChange',val)
            },

            //一時的なカラー変更
            tempColorChange(val){
                this.$store.dispatch('tempColorChange',val)
            },
            
            //モード変更 
            changeMode(val){
                this.$store.dispatch('changeMode',val)
                this.modalShow()
            },

            //カラー変更
            changeColor(val){
                this.$store.dispatch('changeColor',val)
                this.modalShow()
            }
        },

        computed: {
            //一時的なモード変更フラグ取得
            modeLength(){
                return this.$store.state.mode.length
            },

            //一時的なカラー変更フラグ取得
            colorLength(){
                return this.$store.state.color.length
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
                    'selectColor': this.$store.state.color[0].value,
                }
            }
        },

        created() {
            this.getEmail();
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

    .setting{
        width: 100%;
        height: 100%;
        @include mainBackground;

        p{
            @include textColor;
        }

        &_header {
            height: 3rem;
            width: 100%;
            border-bottom:1px solid var(--modeBorderColor);
            @include flexCenter;
            user-select: none;
            img{
                width: 26px;
                height: 26px;
                margin-right:10px;
            }
            p{
                font-size:20px;
            }
        }

        &_sub_header{
            height:40px;
            background: rgb(48, 47, 47);
            font-weight: bold;
            line-height: 40px;
            padding-left: 20px;
            user-select: none;
        }

        &_title {
            margin-left: 20px;
            font-size: 14px;
            user-select: none;
        }

        &_value {
            margin-left: 30px;
            color:#b3b1b1;

            &_pass {
                margin-left: 56px;
                color:#b3b1b1;
            }

            &_mode {
                margin-left:86px;

                p{
                    color:#b3b1b1;
                } 
            }

            &_color {
                margin-left:86px;

                p{
                    color:#b3b1b1;
                } 
            }
        }

        &_button{
            height: 24px;
            width: 60px;
            margin: auto 0;
            @include backSelectColor;
            border-radius: 10px;
            text-align: center;
            line-height: 24px;
            color:#000000;
            font-weight: bold;
            position: absolute;
            top: 5px;
            right: 30px;
            font-size: 14px;

            &:hover{
                @include hoverCursor;
                @include hoverColor;
            }
        }

        &_contents {
            height: calc(100vh - 7rem);

            &_wrapper{
                height: 36px;
                line-height: 36px;
                border-bottom:1px solid var(--modeBorderColor);
                @include flex;
                position: relative;
            }
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

        p{
            @include textColor;
        }

        .email_modal {
            z-index: 100;
            width: 430px;
            height: 230px;
            @include subBackGround;
            margin: 220px auto;
            overflow:hidden;

            form {
                margin: 50px 0;
                @include flex;
                justify-content: center;
                position: relative;

                small {
                    position: absolute;
                    top: -22px;
                    right: 30px;
                    color: #ff0000;
                    font-size: 12px;
                }

                .email{
                    outline:none;
                }

                .atto{
                    margin:0 4px;
                    color: #ffffff;
                    font-weight: bold;
                }

                .domain{
                    width: 100px;
                    outline:none;
                }
            }
        }

        .password_modal {
            z-index: 100;
            width: 430px;
            height: 230px;
            @include subBackGround;
            margin: 220px auto;
            overflow:hidden;

            form {
                height: 140px;
                @include flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;

                .new_pass {
                    margin-top: 14px;
                    position: relative;
                    small {
                        position: absolute;
                        top: -22px;
                        right: 0;
                        color: #ff0000;
                        font-size: 12px;
                    }
                }

                .conf_pass {
                    margin-bottom: 14px;
                    position: relative;
                    small {
                        position: absolute;
                        top: -22px;
                        right: 0;
                        color: #ff0000;
                        font-size: 12px;
                    }
                }

                label{
                    @include textColor;
                }

                input {
                    outline:none;
                    padding: 0 4px;
                }

            }
        }

        .delete_modal{
            z-index: 100;
            width: 430px;
            height: 230px;
            @include subBackGround;
            margin: 220px auto;
            overflow:hidden;

            &_text{
                height:140px;
                @include flexCenter;
            }

            .delete_judge_button{
                @include flex;
                justify-content: space-around;
                .button_wrapper{
                    padding-left:10px;
                }
            }
        }

        & .mode_modal{
            z-index: 100;
            width: 430px;
            height: 230px;
            @include subBackGround;
            margin: 220px auto;
            overflow:hidden;

            & form {
                height: 140px;
                @include flexCenter;

                & .mode_dark {
                    margin-right:20px;
                    
                    &:hover{
                        @include hoverCursor;
                    }
                }

                .mode_light {
                    margin-left: 20px;

                    &:hover{
                        @include hoverCursor;
                    }
                }

                label{
                    margin-left: 1px;
                    @include textColor;
                }
            }
            
        }

        .color_modal{
            z-index: 100;
            width: 430px;
            height: 230px;
            @include subBackGround;
            margin: 220px auto;
            overflow:hidden;

            .select{
                height: 140px;
                @include flexCenter;

                select{
                    outline:none;
                }
            }
        }

        .close_button {
            width: 30px;
            text-align: center;
            margin: 4px 4px 0 auto;
            @include closeButton;
        }

        .title {
            padding-left: 20px;
        }

        .button {
            width: 50px;
            margin: 0 auto;
            margin-right: 10px;
            @include backSelectColor;
            text-align: center;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;

            &:hover{
                @include hoverCursor;
                @include hoverColor;
            }
        }
    }
</style>