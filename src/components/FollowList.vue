<template>
    <div class="follow_list" :style="selectStyle">
        <div 
            class="follow_list_wrapper"
            @click.prevent="detailModalOpen('detailUser',list.user_id,list.user_no)">
            <div class="follow_list_icon">
                <div class="follow_list_icon_wrapper">
                    <img 
                        :src="list.userimage_url? list.userimage_url : require('@/assets/firsticon.png')" 
                        alt="icon">
                </div>
            </div>
            <div class="follow_list_contents">
                <div class="follow_list_user">
                    <div class="follow_list_user_info">
                        <p class="follow_list_name">{{list.user_name}}</p>
                        <p class="follow_list_id">{{list.user_id}}</p>
                    </div>
                </div>
                <div class="follow_list_introduction">
                    <p>{{list.self_introduction}}</p>
                </div>
            </div>
            <div 
                class="follow_list_flag"
                v-if="list.user_no !== userNo">
                <div 
                    class="follow_button"
                    v-if="list.following_flag === userNo"
                    @click.stop="removeFollow(list.user_no)">
                    <p>フォロー解除</p>
                </div>
                <div
                    class="follow_button"
                    v-else
                    @click.stop="addFollow(list.user_no)">
                    <p>フォローする</p>
                </div>
                <p 
                    v-if="list.followed_flag === userNo"
                    class="followed_flag">フォローされています</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                //自分のユーザー番号取得
                userNo: this.$store.state.users.users[0].id
            }
        },

        props: {
            list:{ 
                type: Object,
                required: true,
            },
        },

        methods: {
            //フォローリストをクリック 詳細表示
            async detailModalOpen(type,id,user_no){

                //クリックしたのが自分なら自分のプロフィールページへ
                if(user_no === this.userNo){
                    this.$store.dispatch('changePage','profile')
                    this.$store.dispatch('details/resetClose')
                
                //自分以外は詳細モーダルへ
                }else{
                    const data = {
                        type: type,
                        id: id,
                        userNo: user_no
                    }
                    //詳細モーダルを開く際、スクロール位置を保存
                    this.$store.dispatch('details/setScrollPosition')
                    this.changeModal(data)
                    scrollTo(0,0)
                }
            },

            //データを詳細モーダルへ
            changeModal(data){
                this.$store.dispatch('details/changemodal',data)
            },

            //フォロー追加
            addFollow(userId){
                const data = {
                    id: userId,
                    type: "detailsFollows"
                }
                this.$store.dispatch('follows/addFollow',data ,{ root: true})
            },

            //フォロー解除
            removeFollow(userId){
                const data = {
                    id: userId,
                    type: "detailsFollows"
                }

                this.$store.dispatch('follows/removeFollow',data ,{ root: true})
            },
        },

        computed: {
            //select mode color 取得
            selectStyle() {
                return {
                    '--modeMainBackGround':this.$store.state.mode[0].main_color,
                    '--modeSubBackGround':this.$store.state.mode[0].sub_color,
                    '--modeTextColor':this.$store.state.mode[0].text_color,
                    '--selectColor': this.$store.state.color[0].value,
                }
            }
        },
    }
</script>

<style lang="scss">

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

    .follow_list {
        width: 800px;
        margin-bottom: 2px;
        @include flexCenter;
        background: var(--modeMainBackGround);

        &_wrapper{
            width: 790px;
            height: 80px;
            background: var(--modeSubBackGround);
            @include flex;

            &:hover{
                cursor:pointer;
            }

        }

        &_icon{
            width: 70px;
            @include flex;
            justify-content: center;
            padding-top:6px;

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

        &_contents{
            padding-top:6px;
            width: 600px;
        }

        &_user_info{
            @include flex;
        }

        &_id{
            color:rgb(123, 123, 123);
        }

        &_introduction{
            width: 600px;
            p{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap; 
            }   
        }

        &_flag{
            width: 120px;
            @include flexCenter;
            flex-direction: column;
            position: relative;

            .follow_button{
                @include backSelectColor;
                height:30px;
                width: 110px;
                @include flexCenter;
                border-radius: 20px;

                &:hover{
                    cursor: pointer;
                    background: #11ec98;
                }

                p{
                    font-size: 15px;
                    font-weight: bold;
                    color: #000000;
                }

                
            }

            .followed_flag{
                font-size: 10px;
                position: absolute;
                bottom: 8px;
            }
        }
    }

    p {
        color: var(--modeTextColor)
    }
</style>