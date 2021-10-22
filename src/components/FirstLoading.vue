<template>
    <div class="first_loading" :style="selectStyle">
        <div class="loading_word">
            <p>{{loadingWord}}</p>
            <input 
                class="percent"
                type="text" 
                v-model="loading_percent">
            <p>%</p>
        </div>
        <div 
            class="loading_gage"
            :class='`${loadingState}`'>
        </div>
    </div>
</template>

<script>

export default{
    data(){
        return {
            //画面パーセント値
            loading_percent: 0,
        }
    },

    //ロード時の％カウントアップ
    watch:{
        'loadingNumber': function(newValue){

            const countUp = () =>{
                if(newValue > this.loading_percent){
                    this.loading_percent++
                    setTimeout(countUp, 20)
                }
            }

            countUp()
        }
    },

    computed:{
        //画面パーセントの値取得
        loadingNumber(){
            return this.$store.state.loadingNumber
        },

        //画面表示の文章取得
        loadingWord(){
            return this.$store.state.loadingWord
        },

        //画面の状態 取得
        loadingState(){
            return this.$store.state.loadingState
        },

        //select mode color 取得
        selectStyle() {
            return {
                '--modeMainBackGround':this.$store.state.mode[0].main_color,
                '--modeSubBackGround':this.$store.state.mode[0].sub_color,
                '--modeTextColor':this.$store.state.mode[0].text_color,
                '--inputColor': this.$store.state.mode[0].input_color,
                '--selectColor': this.$store.state.color[0].value,
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

    .first_loading{
        width: 100%;
        height: 100%;
        background: var(--modeMainBackGround);
        @include flexCenter;
        flex-direction: column;
    }

    .loading_word{
        @include flex;
        align-items: center;
        margin-bottom: 4px;
        animation: fadeIn 0.2s ease ;

        .percent{
            width: 30px;
            color:white;
            text-align: right;
            font-size:17px;
            margin-left:10px;
            background: var(--modeMainBackGround);
            border: none;
            outline: none;
            user-select: none;
        }

        p {
            color:var(--modeTextColor);
        }
    }

    .loading_gage{
        width: 200px;
        height: 10px;
        border: 1px solid #ffffff;
        border-radius: 5px;
        animation: fadeIn 0.2s ease ;

        &.standby:after{
            content:'';
            z-index:30;
            display: block;
            width: 0px;
            height: 8px;
            border-radius: 5px;
            background: #ffffff;
        }

        &.complete:after{
            content:'';
            z-index:30;
            display: block;
            height: 8px;
            background: #ffffff;
            border-radius: 5px;
            animation:complete 1.0s ease-in-out;
        }
    }

    @keyframes complete{
        0% {
            width: 0px;
        }

        100%{
            width: 200px;
        }
    }

    @keyframes fadeIn { 

        0% {opacity: 0} 

        100% {opacity: 1} 

    }

</style>
