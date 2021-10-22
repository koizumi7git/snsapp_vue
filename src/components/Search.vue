<template>
    <div class="search" :style="selectStyle" :class="{active:detailmodal}">
        <div class="search_header">
            <p>検索ワード</p>
            <img :src="require('@/assets/'+selectStyle.selectColor+'/search.png')" alt="searchIcon">
            <input 
                type="text" 
                v-model="searchWord"
                placeholder="検索ワード入力"
                @keydown.enter="changeContents(searchWord)"/>
        </div>
        <div 
            class="standby_screen"
            v-if="screenValue === 'standby'">
            <p>好きなワードで</p>
            <p>検索してみましょう</p>
        </div>
        <div 
            class="search_contents"
            v-else-if="screenValue === 'active'">
            <ul class="tab"> 
                <li
                    class="tab_item tab1"
                    :class="{active: activeTab === 'post'}">
                    <p @click.prevent="changeTab('post')">投稿</p>
                </li>
                <li
                    class="tab_item tab2"
                    :class="{active: activeTab === 'account'}">
                    <p @click.prevent="changeTab('account')"> アカウント</p>
                </li>
                <div class="active_bar">
                </div>
            </ul>
            <div class="tab_contents">
                <div
                    class="tab_list"
                    v-show="activeTab === 'post'">
                    <div 
                        v-if="searchList.search_post.length"
                        class="search_list">
                        <List v-for="list in searchList.search_post.slice(0,searchPostCounter)" :list="list" :key="list.id"/>
                        <div
                            v-if="searchList.search_post.length > searchPostCounter"
                            class="counter">
                            <div
                                @click="searchPostCount()"
                                class="counter_button">
                                <p>さらに投稿を見る</p>
                            </div>
                        </div>
                    </div>
                    <div 
                        v-else
                        class="dont_search">
                        <p>該当する投稿はありませんでした</p>
                    </div>
                </div>
                <div
                    class="tab_list"
                    v-show="activeTab === 'account'">
                    <div 
                        v-if="searchList.search_user.length"
                        class="search_list">
                        <FollowList v-for="list in searchList.search_user.slice(0,searchUserCounter)" :list="list" :key="list.id"/>
                        <div
                            v-if="searchList.search_user.length > searchUserCounter"
                            class="counter">
                            <div
                                @click="searchUserCount()"
                                class="counter_button">
                                <p>さらに投稿を見る</p>
                            </div>
                        </div>
                    </div>
                    <div 
                        v-else
                        class="dont_search">
                        <p>該当するアカウントはありませんでした</p>
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
    components: {
        List,
        FollowList
    },

    data(){
        return{
            //検索ワード
            searchWord: this.$store.state.searchWord,
            //検索した投稿、ユーザーのリスト表示数
            searchPostCounter: 50,
            searchUserCounter: 50
        }
    },

    methods:{
        //投稿、アカウントのタブ切替
        changeTab(tabName){
            this.$store.dispatch('searchChangeTab',tabName)
        },

        //検索ワードでそれぞれのリスト取得
        changeContents(word){
            if(word !== ""){
                var likeword = "%" + word + "%"
                console.log(likeword)
                var data = {
                    value: "active",
                    searchWord: likeword
                };
            
                this.$store.dispatch('setSearchWord',word)
                this.$store.dispatch('posts/getSearchList',data)
            }else{
                if(this.$store.state.posts.searchList.search_post.length !== 0){
                    this.$store.dispatch('posts/resetSearch')
                }
            }
            
        },

        //さらに見るをクリックした場合、表示するリスト数変更
        searchPostCount(){
            this.searchPostCounter = this.searchPostCounter + 50
        },

        searchUserCount(){
            this.searchUserCounter = this.searchUserCounter + 50
        }
        //ここまで
    },

    computed:{
        //現在のアクティブタブ取得
        activeTab(){
            return this.$store.state.searchActiveTab
        },

        //現在検索機能が実行されているかどうか ページ切替
        screenValue(){
            return this.$store.state.searchScreenValue
        },

        //検索したリスト取得
        searchList(){
            return this.$store.state.posts.searchList
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

        //詳細モーダル時 スクロール移動防ぐためのフラグ取得
        detailmodal(){
            return this.$store.state.details.detailsList[0]
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

    @mixin mainBackground{
        background: var(--modeMainBackGround);
    }

    .search{
        width: 800px;
        min-height: calc(100vh - 4rem);
        @include mainBackground;

        &_header {
            height: 3rem;
            width: 800px;
            @include mainBackground;
            border-bottom:1px solid var(--modeBorderColor);
            position: sticky;
            top: 4rem;
            z-index: 3;
            @include flexCenter;
            user-select:none;

            p {
                color: var(--modeTextColor);
                margin-right: 10px;
                
            }

            img {
                width: 26px;
                height: 26px;
                margin-right: 16px;
                animation: rotate 7s linear infinite;
            }

            input {
                height: 1.8rem;
                width: 300px;
                align-items: center;
                border: none;
                outline: none;
                padding: 4px;
            }
        }

        &_contents {
            width: 800px;
            min-height: calc(100vh - 7rem);
            @include mainBackground;

            .tab{
                height: 3rem;
                @include flex;
                position: sticky;
                top: 7rem;
                z-index: 3;
                @include mainBackground;
                border-bottom:1px solid var(--modeBorderColor);
                user-select:none;

                li{
                    list-style: none;
                }

                &_item{
                    width: 50%;
                    @include flexCenter;

                    p{
                        &:hover{
                            cursor: pointer;
                        }
                    }
                }

                &_contents{
                    min-height: calc(100vh - 10rem);
                    @include mainBackground;
                }

                &_list{

                    .search_list{
                        padding-top: 4px;
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
                    }

                    .dont_search{
                        min-height: calc(100vh - 10rem);
                        @include flexCenter;
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
                    left: 15%;
                    transition: .3s ease-in-out;
                }

                .tab2.active~.active_bar{
                    left: 65%;
                    transition: .3s ease-in-out;
                }
            }
        }

        .standby_screen{
            width: 800px;
            height: calc(100vh - 7rem);
            @include mainBackground;
            @include flexCenter;
            flex-direction: column;

            p{
                margin: 20px 0;
            }
        }
    }

    //詳細モーダル時 スクロール移動防ぐ
    .search.active{
        position: fixed;
        width: 800px;
        top: calc((var(--scrolly) * -1px) + 64px);

        .contents{
            position:fixed;
        }
    }

    @keyframes rotate {
        0%{
            transform: rotateY(0deg)
        }
        100%{
            transform: rotateY(360deg)
        }
        
    }
</style>