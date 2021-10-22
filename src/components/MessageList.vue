<template>
    <div 
        class="messagelist"
        :class="{me:list.user_no === myId}">
        <div class="messagelist_wrapper">
            <div  
                class="medhia_wrapper video"
                v-if="list.first_medhia_url !== null && list.first_medhia_name.indexOf('mp4') !== -1"
                @click.stop="medhiaModalOpen(list.first_medhia_url)">
                <img :src="list.thumbnail_url" alt="video_thumbnail" class="video_thumbnail">
                <img src="@/assets/playback.png" alt="playback" class="playback">
                <div 
                    class="time"
                    v-if="list.message === null && list.second_medhia_url === null">
                    <p>{{list.created_at}}</p>
                </div>
            </div>
            <div
                class="medhia_wrapper"
                v-if="list.first_medhia_url !== null && list.first_medhia_name.indexOf('mp4') === -1"
                @click.stop="medhiaModalOpen(list.first_medhia_url)">
                <img :src="list.first_medhia_url" alt="">
                <div 
                    class="time"
                    v-if="list.message === null && list.second_medhia_url === null">
                    <p>{{list.created_at}}</p>
                </div>
            </div>
            <div
                class="medhia_wrapper"
                v-if="list.second_medhia_url !== null"
                @click.stop="medhiaModalOpen(list.second_medhia_url)">
                <img :src="list.second_medhia_url" alt="">
                <div 
                    class="time"
                    v-if="list.message === null">
                    <p>{{list.created_at}}</p>
                </div>
            </div>
            <div 
                class="text_wrapper"
                v-if="list.message !== null">
                <div 
                    class="text">
                    <p>{{list.message}}</p>
                </div>
                <div class="time">
                    <p>{{list.created_at}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list:{ 
            type: Object,
            required: true,
        },
    },

    data(){
        //自分のuserナンバー取得
        return{
            myId:this.$store.state.users.users[0].id
        }
    },

    methods: {
        //画像・動画がクリックされたら、メディアモーダル開く
        medhiaModalOpen(data){    
            this.$store.dispatch('posts/setMedhiaInfo',data)
        },
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

    .messagelist{
        @include flex;
        justify-content: flex-start;
        margin:10px 0;
        .messagelist_wrapper{
            @include flex;
            flex-direction: column;
            align-items: flex-start;
            margin:0 10px;

            .medhia_wrapper{
                width: 100px;
                height: 100px;
                margin:2px 0;
                position:relative;

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

                .video{

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
                }
                
                img{
                    width:100%;
                    height:100%;
                    object-fit: contain;
                    background: #000000;
                    border-radius: 6px;
                }

                .time{
                    position: absolute;
                    right:-56px;
                    bottom: -2px;
                    width: 50px;
                    display: flex;
                    justify-content: flex-start;

                    p{
                        font-size:10px;
                    }
                }

                &:hover{
                    cursor:pointer;

                    &:after{
                        content:'';
                        position: absolute;
                        background: var(--selectColor);
                        opacity: 0.5;
                        height:100%;
                        width: 100%;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        border-radius: 6px;
                    }   
                }

            }

            .text_wrapper{
                position:relative;
                display: inline-block;

                .text{
                    @include flex;
                    background: var(--selectColor);
                    border-radius: 10px;
                    max-width: 380px;
                    p{
                        padding:2px 10px;
                        color:#000000;
                    }
                }

                .time{
                    position: absolute;
                    right:-56px;
                    bottom: -2px;
                    width: 50px;
                    display: flex;
                    justify-content: flex-start;

                    p{
                        font-size:10px;
                    }
                }
            }
        }
    }

    .messagelist.me{
        justify-content: flex-end;
        .messagelist_wrapper{
            align-items: flex-end;
            .time{
                left:-56px;
                justify-content: flex-end;
            }
        }
    }
</style>
