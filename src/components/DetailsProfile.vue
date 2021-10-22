<template>
    <div class="details_profile">
        <div class="details_profile_wrapper">
            <div class="details_profile_left">
                <div class="user_icon">
                    <img :src="detailsList.userInfo[0].userimage_url? detailsList.userInfo[0].userimage_url : require('@/assets/firsticon.png')" alt="icon">
                </div>
                <p class="user_name">{{ detailsList.userInfo[0].user_name }}</p>
                <p class="user_id">{{ detailsList.userInfo[0].user_id }}</p>
            </div>
            <div class="details_profile_center">
                <div class="self_introduction">
                    <p>{{ detailsList.userInfo[0].self_introduction }}</p>
                </div>
                <div class="numbers">
                    <div class="post_number">
                        <p>投稿数</p>
                        <p>{{detailsList.postCount}}</p>
                    </div>
                    <div class="follow_number">
                        <p>フォロー数</p>
                        <p>{{ detailsList.userFollowInfo.following_count}}</p>
                    </div>
                    <div class="follower_number">
                        <p>フォロワー数</p>
                        <p>{{detailsList.userFollowInfo.followed_count}}</p>
                    </div>
                </div>
            </div>
            <div class="details_profile_right">
                <div 
                    class="follow_button"
                    v-if="detailsList.followFlag === 1"
                    @click.prevent="removeFollow(detailsList.userInfo[0].id)">
                    <p>フォロー解除</p>
                </div>
                <div 
                    class="follow_button"
                    v-else
                    @click.prevent="addFollow(detailsList.userInfo[0].id)">
                    <p>フォローする</p>
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
                <List v-for="list in detailsList.userPost.slice(0,listCounter)" :list="list" :key="list.id" />
                <div 
                    v-if="detailsList.userPost.length > listCounter"
                    class="counter">
                    <div
                        @click="addListCount()"
                        class="counter_button">
                        <p>さらに投稿を見る</p>
                    </div>
                </div>
            </div>
            <div 
                class="tab_list"
                v-show="isActive('follows')">
                <FollowList v-for="list in detailsList.userFollowInfo.following_list.slice(0,followingListCounter)" :list="list" :key="list.id" />
                <div 
                    v-if="detailsList.userFollowInfo.following_list.length > followingListCounter"
                    class="counter">
                    <div
                        @click="addFollowingListCount()"
                        class="counter_button">
                        <p>さらに見る</p>
                    </div>
                </div>
            </div>
            <div 
                class="tab_list"
                v-show="isActive('followed')">
                <FollowList v-for="list in detailsList.userFollowInfo.followed_list.slice(0,followedListCounter)" :list="list" :key="list.id" />
                <div 
                    v-if="detailsList.userFollowInfo.followed_list.length > followedListCounter"
                    class="counter">
                    <div
                        @click="addFollowedListCount()"
                        class="counter_button">
                        <p>さらに見る</p>
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

    data(){
        return{
            activeTab: this.$store.state.profileCurrentTab,
            listCounter : 100,
            followingListCounter: 100,
            followedListCounter: 100,
        }
    },

    components: {
        List,
        FollowList,
    },

    methods:{
        //タブの切替フラグ
        isActive(nextTab){
            return this.activeTab === nextTab;
        },

        //クリック タブ切替
        changeActive(nextTab){
            this.activeTab = nextTab;
        },

        //フォロー解除
        removeFollow(detailsUserId){
            const data = {
                id: detailsUserId,
                type: "detailsUsers"
            }

            this.$store.dispatch('follows/removeFollow',data ,{ root: true})
        },

        //フォロー追加
        addFollow(detailsUserId){
            const data = {
                id: detailsUserId,
                type: "detailsUsers"
            }

            this.$store.dispatch('follows/addFollow',data ,{ root: true})
        },

        //投稿リストのさらに見るをクリックした際 表示する数追加
        addListCount(){
            this.listCounter = this.listCounter + 50
        },

        //フォローリストのさらに見るをクリックした際 表示する数追加
        addFollowingListCount(){
            this.followingListCounter = this.followingListCounter + 50
        },

        //フォロワーリストのさらに見るをクリックした際 表示する数追加
        addFollowedListCount(){
            this.followedListCounter = this.followedListCounter + 50
        }

    },

    computed:{
        //詳細モーダルに送られたデータを取得
        detailsList(){
            return this.$store.state.details.detailsList[0]
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

@mixin mainBackground{
    background: var(--modeMainBackGround);
}

@mixin backSelectColor{
    background: var(--selectColor);
}

.details_profile {

    min-height: calc(100vh - 7rem);
    width: 800px;
    @include mainBackground;
    p{
        color: var(--modeTextColor)
    }

    &_wrapper{
        height: 178px;
        width: 800px;
        @include mainBackground;
        @include flex;
        border-bottom: 1px solid var(--modeBorderColor);
        position: fixed;
        top:7rem;
        z-index: 9;
    }

    &_left {
        width: 160px;
        @include flexCenter;
        flex-direction: column;

        .user_icon{
            width: 78px;
            height: 78px;

            img {
                width:100%;
                height:100%;
                object-fit: contain;
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
            display: flex;
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
        .follow_button {
            width: 70%;
            margin: 0 auto;
            padding: 6px;
            border-radius: 10px;
            text-align: center;
            @include backSelectColor;
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

}

.tab {
    @include flex;
    height: 40px;
    width: 800px;
    @include mainBackground;
    border-bottom:1px solid var(--modeBorderColor);
    position: fixed;
    top: calc(7rem + 178px);
    z-index: 9;

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
        position: absolute;
        top: 218px;
        min-height: calc(100vh - 330px);
        width: 100%;
        @include mainBackground;
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
                @include backSelectColor;
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