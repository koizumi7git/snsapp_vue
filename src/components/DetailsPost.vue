<template>
    <div class="post_details" :style="selectStyle">
        <div class="blank">
            <div class="blank_content">
            </div>
        </div>
        <div class="main_post">
            <List v-for="list in detailsList.postDetails.post_details" :list="list" :key="list.id"/>
        </div>
        <div class="blank">
            <div class="blank_content">
            </div>
        </div>
        <div class="reply_post">
            <List v-for="list in detailsList.postDetails.reply_details.slice(0,replyListCounter)" :list="list" :key="list.id"/>
            <div
                v-if="detailsList.postDetails.reply_details.length > replyListCounter"
                class="counter">
                <div
                    class="counter_button"
                    @click="addreplyListCount()">
                    <p>さらに返信を見る</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import List from "@/components/List";

export default{

    components: {
        List,
    },

    data(){
        return{
            //返信を表示する数
            replyListCounter: 30
        }
    },

    methods:{
        //さらに返信を見るをクリックした際、表示する数を追加
        addreplyListCount(){
            this.replyListCounter = this.replyListCounter + 15
        }
    },

    computed:{
        //詳細モーダルに送られたデータを取得
        detailsList(){
            return this.$store.state.details.detailsList[0]
        },

        selectStyle() {
            return {
                '--modeMainBackGround':this.$store.state.mode[0].main_color,
                '--modeBorderColor':this.$store.state.mode[0].border_color,
                '--selectColor': this.$store.state.color[0].value,
                'selectColor': this.$store.state.color[0].value,
            }
        },
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

@mixin backSelectColor{
    background: var(--selectColor);
}

.post_details {
    min-height: calc(100vh - 7rem);
    width: 800px;
    background: var(--modeMainBackGround);
    border-right: 1px solid var(--modeBorderColor);
}

.main_post{
    width: 800px;
    padding-top: 2px;
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

.reply_post{
    padding-top: 2px;
    padding-bottom: 2px;

    & .counter{
        @include flex;
        justify-content: center;
        padding-top: 3px;
        padding-bottom: 3px;

        &_button{
            @include backSelectColor;
            border-radius: 10px;
            width: 200px;
            display: flex;
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
}
</style>
