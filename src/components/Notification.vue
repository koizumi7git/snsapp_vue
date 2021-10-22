<template>
    <div class="notification">
        <div class="notification_header">
            <img :src="require('@/assets/'+selectStyle.selectColor+'/bell.png')" >
            <p>通知</p>
        </div>
        <div class="notification_contents">
            <div class="tab">
                <div 
                    class="tab_item tab1"
                    :class="{active: activeTab === 'reply'}">
                    <p @click.prevent="changeTab('reply')">返信</p>
                </div>
                <div 
                    class="tab_item tab2"
                    :class="{active: activeTab === 'other'}">
                    <p @click.prevent="changeTab('other')">その他</p>
                </div>
                <div class="active_bar">
                </div>
            </div>
            <div class="tab_contents">
                <div 
                    class="tab_list"
                    v-show="activeTab ==='reply'">
                    <div 
                        class="notification_list"
                        v-if="notificationList.notification_reply.length">
                        <List v-for="list in notificationList.notification_reply" :list="list" :key="list.id"/>
                    </div>
                    <div 
                        class="not_notification"
                        v-else>
                        <p>返信はありません</p>
                    </div>
                </div>
                <div 
                    class="tab_list"
                    v-show="activeTab ==='other'">
                    <div 
                        class="notification_list"
                        v-if="notificationList.notification_other.length">
                        <div v-for="list in notificationList.notification_other" :list="list" :key="list.id">
                            <div class="notification_other">
                                <div class="infomation">
                                    <div class="icon">
                                        <div class="icon_wrapper">
                                            <img :src="list.userimage_url" alt="icon">
                                        </div>
                                    </div>
                                    <div class="message">
                                        <div v-if="list.type === 'follow'">
                                            <p>{{list.user_name}}さんにフォローされました</p>
                                        </div>
                                        <div v-else-if="list.type === 'favorite'">
                                            <p>{{list.user_name}}さんがあなたの投稿をお気に入りしました</p>
                                        </div>
                                        <div v-else-if="list.type === 'share'">
                                            <p>{{list.user_name}}さんがあなたの投稿をシェアしました</p>
                                        </div>
                                    </div>
                                    <div class="time">
                                        <p>{{list.created_at}}</p>
                                    </div>
                                </div>
                                <div 
                                    class="notification_other_contents">
                                    <div 
                                        v-if="list.text !== null"
                                        class="text"
                                        :class="{first:list.first_medhia_url !== null,second:list.second_medhia_url !== null}">
                                        <p>{{list.text}}</p>
                                    </div>
                                    <div
                                        v-if="list.first_medhia_url !== null" 
                                        class="first_medhia">
                                        <div
                                            v-if="list.thumbnail_url !== null">
                                            <img :src="thumbnail_url" alt="video">
                                        </div>
                                        <div
                                            v-else>
                                            <img :src="list.first_medhia_url" alt="image">
                                        </div>
                                    </div>
                                    <div 
                                        v-if="list.second_medhia_url !== null" 
                                        class="second_medhia">
                                        <img :src="list.second_medhia_url" alt="image">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div 
                        class="not_notification"
                        v-else>
                        <p>通知はありません</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import List from "@/components/List";

export default {
    components:{
        List
    },

    methods:{
        //通知リストのタブ切替
        changeTab(tabName){
            this.$store.dispatch('notificationChangeTab',tabName)
        }
    },

    computed:{
        //現在のアクティブタブ取得
        activeTab(){
            return this.$store.state.notificationActiveTab;
        },

        //通知リスト取得
        notificationList(){
            return this.$store.state.posts.notificationList
        }, 

        //select mode color 取得
        selectStyle() {
            return {
                '--modeMainBackGround':this.$store.state.mode[0].main_color,
                '--modeSubBackGround':this.$store.state.mode[0].sub_color,
                '--modeTextColor':this.$store.state.mode[0].text_color,
                '--modeBorderColor':this.$store.state.mode[0].border_color,
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

    @mixin subBackGround{
        background: var(--modeSubBackGround);
    }
    
    .notification{
        width: 800px;
        height: 100%;
        @include mainBackground;

        &_header{
            height: 3rem;
            border-bottom: 1px solid var(--modeBorderColor);
            @include flexCenter;
            position: sticky;
            top:4rem;
            z-index: 3;
            @include mainBackground;
            user-select:none;
            img{
                width: 26px;
                height: 26px;
                margin-right:10px;
            }
            p{
                font-size: 20px;
            }
        }

        &_contents{
            min-height: calc(100vh - 7rem);
            @include mainBackground;

            .tab{
                height: 3rem;
                @include flex;
                border-bottom: 1px solid var(--modeBorderColor);
                position: sticky;
                top: 7rem;
                z-index: 3;
                @include mainBackground;

                &_item{
                    width: calc(800px/2);
                    @include flexCenter;
                    user-select:none;
                    p{
                        font-size: 18px;
                        &:hover{
                            cursor: pointer;
                        }
                    }
                }

                .active_bar {
                    position: absolute;
                    bottom:0;
                    left: 15;
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

                &_list{
                    min-height: calc(100vh - 10rem);

                    .notification_list{
                        min-height: calc(100vh - 10rem);
                        padding-top: 4px;
                        padding-bottom: 2px;
                        @include flex;
                        align-items: center;
                        flex-direction: column;

                        .notification_other{
                            width: 792px;
                            margin-bottom: 2px;
                            @include subBackGround;
                            @include flexCenter;
                            flex-direction: column;

                            .infomation{
                                @include flex;
                                padding:10px;
                                .icon{
                                    width: 100px;
                                    @include flexCenter;

                                    &_wrapper{
                                        width: 50px;
                                        height: 50px;
                                        img{
                                            width:100%;
                                            height:100%;
                                            object-fit: contain;
                                            background: #000000;
                                            border-radius: 6px;
                                        }
                                    }
                                }

                                .message{
                                    width: 572px;
                                    @include flex;
                                    align-items: center;
                                }

                                .time{
                                    width: 100px;
                                    @include flex;
                                    justify-content: flex-end;
                                    align-items: center;
                                    padding-right:10px;
                                    font-size: 13px;
                                }
                            }

                            &_contents{
                                margin:0 110px;
                                margin-bottom: 16px;
                                width: 572px;
                                border-radius: 10px;
                                background: #2b2a2a;
                                @include flex;
                                align-items:center;
                                .text{
                                    width: 100%;
                                    p{
                                        padding: 10px 10px;
                                    }
                                }
                                
                                .text.first{
                                    width: 472px;
                                }

                                .text.first.second{
                                    width: 372px;
                                }

                                .first_medhia{
                                    width: 100px;
                                    height: 100px;
                                    img{
                                        width:100%;
                                        height:100%;
                                        object-fit: contain;
                                        background: #000000;
                                        border-radius: 6px;
                                    }
                                }
                                .second_medhia{
                                    width: 100px;
                                    height: 100px;

                                    img{
                                        width:100%;
                                        height:100%;
                                        object-fit: contain;
                                        background: #000000;
                                        border-radius: 6px;
                                    }
                                }  
                            }
                        }
                    }

                    .not_notification{
                        min-height: calc(100vh - 10rem);
                        @include flexCenter;
                    }
                }
            }
        }
    }
</style>