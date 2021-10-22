<template>
    <div class="tl_container" :style="selectStyle" :class="{active:detailmodal}">
        <ul class="tab">
            <li
                class="tab_item tab1"
                :class="{active: isActive('all')}">
                <img 
                    :src="isActive('all')? require('@/assets/'+selectStyle.selectColor+'/all.png') : require('@/assets/all.png')" 
                    alt="followPost"
                    @click="changeActive('all')">
            </li>
            <li
                class="tab_item tab2"
                :class="{active: isActive('my')}">
                <img 
                    class="my_post_img" 
                    :src="isActive('my')? require('@/assets/'+selectStyle.selectColor+'/me.png'): require('@/assets/me.png')"
                    alt="myPost" 
                    @click="changeActive('my')">
            </li>
            <li
                class="tab_item tab3"
                :class="{active: isActive('favorite')}">
                <img 
                    class="star_img" 
                    :src="isActive('favorite')? require('@/assets/'+selectStyle.selectColor+'/star.png'):require('@/assets/star.png')" 
                    alt="favorite"
                    @click="changeActive('favorite')">
            </li>
            <li
                class="tab_item tab4"
                :class="{active: isActive('medhia')}">
                <img 
                    class="medhia_img" 
                    :src="isActive('medhia')? require('@/assets/'+selectStyle.selectColor+'/medhia.png'):require('@/assets/medhia.png')" 
                    alt="medhia"
                    @click="changeActive('medhia')">
            </li>
            <li
                class="tab_item tab5"
                :class="{active: isActive('hot')}">
                <img 
                    class="hot_img" 
                    :src="isActive('hot')? require('@/assets/'+selectStyle.selectColor+'/hot.png'): require('@/assets/hot.png')" 
                    alt="hot"
                    @click="changeActive('hot')">
            </li>
            <div class="active_bar">
            </div>
        </ul>
        <div class="tab_contents">
            <div
                class="tab_list"
                v-show="isActive('all')">
                <div v-if="allLists.length>0">
                    <List v-for="list in allLists.slice(0,allListCounter)" :list="list" :key="list.id"/>
                    <div 
                        v-if="allLists.length > allListCounter"
                        class="counter">
                        <div
                            @click="addAllListCount()"
                            class="counter_button">
                            <p>さらに投稿を見る</p>
                        </div>
                    </div>
                </div>
                <div 
                    v-else
                    class="empty_list">
                    <p>フォローしている人とあなたの投稿一覧です。</p>
                    <p>まだ投稿はありません。</p>
                    <p>左メニューから投稿したり、</p>
                    <p>検索から気になる人をフォローしてみましょう。</p>
                </div>
            </div>
            <div
                class="tab_list"
                v-show="isActive('my')">
                <div v-if="myLists.length>0">
                    <List v-for="list in myLists.slice(0,myListCounter)" :list="list" :key="list.id"/>
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
                    <p>自分の投稿一覧です。</p>
                    <p>まだ投稿はありません。</p>
                    <p>左メニューから投稿してみましょう。</p>
                </div>
            </div>
            <div
                class="tab_list"
                v-show="isActive('favorite')">
                <div
                    v-if="favoriteLists.length>0">
                    <List v-for="list in favoriteLists.slice(0,favoriteListCounter)" :list="list" :key="list.id"/>
                    <div
                        v-if="favoriteLists.length > favoriteListCounter"
                        class="counter">
                        <div
                            class="counter_button"
                            @click="addFavoriteListCount()">
                            <p>さらに投稿を見る</p>
                        </div>
                    </div>
                </div>
                <div 
                    v-else
                    class="empty_list">
                    <p>お気に入り一覧です。</p>
                    <p>気になる投稿をお気に入りしてみましょう。</p>
                </div>
            </div>
            <div
                class="tab_list"
                v-show="isActive('medhia')">
                <div
                    v-if="medhiaLists.length>0">
                    <List v-for="list in medhiaLists.slice(0,medhiaListCounter)" :list="list" :key="list.id"/>
                    <div
                        v-if="medhiaLists.length > medhiaListCounter"
                        class="counter">
                        <div
                            class="counter_button"
                            @click="addMedhiaListCount()">
                            <p>さらに投稿を見る</p>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="empty_list">
                    <p>画像・動画投稿一覧です。</p>
                </div>
            </div>
            <div
                class="tab_list"
                v-show="isActive('hot')">
                <div
                    v-if="hotLists.length>0">
                    <List v-for="list in hotLists.slice(0,hotListCounter)" :list="list" :key="list.id"/>
                    <div
                        v-if="hotLists.length > hotListCounter"
                        class="counter">
                        <div
                            class="counter_button"
                            @click="addHotListCount()">
                            <p>さらに投稿を見る</p>
                        </div>
                    </div>
                </div>
                <div 
                    v-else
                    class="empty_list">
                    <p>人気の投稿はまだありません</p>
                </div>
            </div>
        </div>    
    </div>
</template>

<script>
import List from "@/components/List";

export default {
    data() {
        return {
            //現在のアクティブタブ
            activeTab: this.$store.state.currentTab,

            //それぞれの投稿リスト表示数
            allListCounter: 50,
            myListCounter: 50,
            medhiaListCounter: 50,
            favoriteListCounter: 50,
            hotListCounter: 50,
            //ここまで
        }
    },

    components: {
        List,
    },

    methods: {

        //現在のアクティブタブチェック
        isActive(nextTab){
            return this.activeTab === nextTab
        },

        //アクティブタブ変更
        changeActive(nextTab){  
            this.activeTab = nextTab
        },
        
        //現在のスクロール位置保存
        handleScroll(){
            this.$store.dispatch('details/scroll',window.scrollY,{root:true});
        },

        //さらに見るをクリックした際、表示するリスト数変更
        addAllListCount(){
            this.allListCounter = this.allListCounter + 50
        },

        addMyListCount(){
            this.myListCounter = this.myListCounter + 50
        },

        addFavoriteListCount(){
            this.favoriteListCounter = this.favoriteListCounter + 50
        },

        addMedhiaListCount(){
            this.medhiaListCounter = this.medhiaListCounter + 50
        },

        addHotListCount(){
            this.hotListCounter = this.hotListCounter + 50
        },
        //ここまで
    },

    computed: {
        //全てのリスト取得
        allLists(){
            return this.$store.state.posts.all_list;
        },

        //自分の投稿リスト取得
        myLists(){
            return this.$store.state.posts.my_list;
        },

        //画像・動画投稿リスト取得
        medhiaLists(){
            return this.$store.state.posts.medhia_list
        },

        //人気投稿リスト取得
        hotLists(){
            return this.$store.state.posts.hot_list
        },

        //お気に入りリスト取得
        favoriteLists(){
            return this.$store.state.favorites.favorite_list;
        },

        //select mode color 取得
        selectStyle() {
            return {
                '--modeMainBackGround':this.$store.state.mode[0].main_color,
                '--modeSubBackGround':this.$store.state.mode[0].sub_color,
                '--modeTextColor':this.$store.state.mode[0].text_color,
                '--selectColor': this.$store.state.color[0].value,
                'selectColor': this.$store.state.color[0].value,
                '--scrolly':this.$store.state.details.test,
            }
        },

        //詳細モーダル開閉フラグ取得
        detailmodal(){
                return this.$store.state.details.detailsList[0]
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

    @mixin backSelectColor{
        background: var(--selectColor);
    }

    @mixin hoverCursor{
        cursor: pointer;
    }

    @mixin hoverColor{
        background: #11ec98;
    }

    .tl_container {
        width: 800px;
        min-height: calc(100vh- 4rem);
        @include mainBackground;
    }

    .tab {
        height: 3rem;
        width: 799px;
        border-bottom:1px solid rgba(255,255,255,0.2);
        position:sticky;
        top: 4rem;
        z-index: 9;
        @include mainBackground;
        @include flex;
        align-items: center;

        &_item {
            height: 3rem;
            width: 20%;
            list-style: none;
            @include flexCenter;

            img {
                width: 30px;
                height: 30px;
                &:hover{
                    @include hoverCursor;
                }
            }

            .my_post_img {
                width: 22px;
                height: 22px;
            }

            .star_img {
                width: 24px;
                height: 24px;
            }

            .medhia_img {
                width: 22px;
                height: 22px;
            }

            .hot_img {
                width: 22px;
                height: 22px;
            }
        }

        &_contents {
            @include mainBackground;
            min-height: calc(100vh- 4rem);
        }

        &_list{
            padding-top: 4px;
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
                        @include hoverCursor;
                    }
                }
            }

            .empty_list{
                height:calc(100vh - 7rem - 6px);
                display:flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                p{
                    margin:10px;
                }
            }
        }
    }

    //details modal時 scroll防ぐ
    .tl_container.active{
        position: fixed;
        width: 800px;
        top: calc((var(--scrolly) * -1px) + 64px);

        .tab{
            position:fixed;
        }
    }

    .active_bar {
        position: absolute;
        bottom: 0;
        left: 15;
        width: 10%;
        height: 2px;
        border-radius: 10px;
        background: linear-gradient(70deg, #f79533,  #ef4e7b, #a166ab, #1098ad, #07b39b, #24d350);
    }

    .tab1.active~.active_bar{
        left:5%;
        transition: .3s ease-in-out;
    }
    .tab2.active~.active_bar{
        left:25%;
        transition: .3s ease-in-out;
    }
    .tab3.active~.active_bar{
        left:45%;
        transition: .3s ease-in-out;
    }
    .tab4.active~.active_bar{
        left:65%;
        transition: .3s ease-in-out;
    }
    .tab5.active~.active_bar{
        left:85%;
        transition: .3s ease-in-out;
    }

    p {
        color: #fff;
    }

</style>