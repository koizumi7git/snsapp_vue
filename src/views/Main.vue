<template>
  <div 
    class="loading"
    v-if="loadingState === 'setup'">
    <Loading/>
  </div>
  <div
    v-else 
    class="flex" 
    :style="selectStyle">
    <SideNavbar></SideNavbar>
    <div
      class="main_container">
      <TimeLine v-if="isActive('timeline')"></TimeLine>
      <Search v-else-if="isActive('search')"></Search>
      <Notification v-else-if="isActive('notification')"></Notification>
      <Message v-else-if="isActive('message')"></Message>
      <Profile v-else-if="isActive('profile')"></Profile>
      <Setting v-else-if="isActive('setting')"></Setting>
    </div>
    <div class="kuuhaku">
    </div>
  </div>
  <!-- details modal -->
  <div 
    class="detail_modal"
    v-if="detailmodal"
    :style="selectStyle">
    <div class="detail_modal_header">
      <div class="back_button" @click.prevent="detailCloseModal()"><img src="@/assets/back_black.png" alt="backbutton"><p>戻る</p></div>
    </div>
    <div class="detail_modal_wrapper">
      <div v-if="detailmodal.type === 'temporary'" class="detail_modal_contents">
        <Loading/>
      </div>
      <div v-else-if="detailmodal.type === 'detailUser'" class="detail_modal_contents">
          <DetailsProfile></DetailsProfile>
      </div>
      <div v-else-if="detailmodal.type === 'detailPost'" class="detail_modal_contents">
          <DetailsPost></DetailsPost>
      </div>
      <div v-else-if="detailmodal.type === 'dontExist'" class="detail_modal_contents dontExist">
          <p>その投稿は削除されました</p>
      </div>
    </div>
  </div>

  <!-- medhia modal-->
  <div 
    class="medhia_overlay"
    v-if="medhiaModal[0]"
    @click.prevent="medhiaModalClose()">
    <div class="medhia_modal">
      <video
        v-if="medhiaModal[0].indexOf('mp4') !== -1" 
        :src="medhiaModal[0]"
        controls
        @click.stop></video>
      <img
        v-else
        :src="medhiaModal[0]"
        @click.stop>
    </div>
  </div>

  <!-- error modal-->
  <div
    class="error_overlay"
    v-if="errorModal !== ''"
    @click.prevent="errorModalClose()">
    <div class="error_modal">
        <div class="error_modal_header">
          <div class="close_button" @click.stop="errorModalClose()">
            <img 
              :src="require('@/assets/error_close.png')" 
              alt="close"
              class="close">
            <img 
              :src="require('@/assets/plus_on.png')" 
              alt="close"
              class="close_hover">
          </div>
        </div>
        <div class="error_modal_contents">
          <img src="@/assets/error.png" alt="error">
          <div class="error_modal_message">
            <p>{{errorModal}}</p>
          </div>
        </div>
    </div>
  </div>

</template>

<script>
import Loading from '@/components/Loading.vue'
import SideNavbar from '@/components/SideNavbar.vue';
import TimeLine from '@/components/TimeLine.vue';
import Search from '@/components/Search.vue';
import Notification from '@/components/Notification.vue';
import Message from '@/components/Message.vue';
import Profile from '@/components/Profile.vue';
import Setting from '@/components/Setting.vue';
import DetailsProfile from '@/components/DetailsProfile.vue';
import DetailsPost from '@/components/DetailsPost.vue';
import firebase from 'firebase';

export default{
  components: {
    Loading,
    SideNavbar,
    TimeLine,
    Search,
    Notification,
    Message,
    Profile,
    Setting,
    DetailsProfile,
    DetailsPost,
  },

  data () {
    return {
      loginCheck: this.$store.state.users.users.length,
    }
  },

  methods: {
    isActive(page){
      return this.currentPage === page
    },

    //メインページアクセス時 ログイン状態確認
    async getData(){
      this.$store.dispatch('setMode')
      this.$store.dispatch('setColor')
        
      //ログイン状態済みの場合 ユーザー情報取得
      if(this.loginCheck === 0){
        await this.$store.dispatch('getUserInfo','logined')
      }

      //各リスト、ログイン状態完了
      await this.$store.dispatch('posts/allList',{ root: true })
      await this.$store.dispatch('posts/myList',{ root: true })
      await this.$store.dispatch('posts/medhiaList',{ root: true })
      await this.$store.dispatch('posts/hotList',{ root: true})
      await this.$store.dispatch('favorites/favoriteList', { root: true})
      await this.$store.dispatch('posts/notificationList',{ root: true })
      await this.$store.dispatch('follows/followInfo', { root: true})
      this.$store.dispatch('loadingValue','login',{ root: true})
      
    },

    //現在のスクロール位置保存
    scrollPosition(){
      this.$store.dispatch('details/scroll',window.scrollY,{root:true})
    },

    //詳細モーダル閉
    async detailCloseModal(){
      await this.$store.dispatch('details/close')
      //前回のスクロール位置へ
      scrollTo(0, this.closeScrollPosition)
      this.$store.dispatch('details/scrolldelete')
    },
    
    //画像・動画モーダル閉
    medhiaModalClose(){
      this.$store.dispatch('posts/resetMedhiaValue')
    },

    //エラーモーダル閉
    errorModalClose(){
      this.$store.dispatch('resetErrorMessage')
    }
  },

  computed: {
    //ログイン状態の確認
    loadingState(){
      return this.$store.state.loadingState
    },
    
    //現在のページ取得
    currentPage(){
      return this.$store.state.currentPage
    },

    //投稿やプロフィール詳細イベント取得
    detailmodal(){
      return this.$store.state.details.detailsList[0]
    },

    //それぞれのモーダル閉じる時 前回のスクロール値取得
    closeScrollPosition(){
      return this.$store.state.details.closedScrollPosition[0]
    },

    //メディアイベント取得
    medhiaModal(){
      return this.$store.state.posts.viewMedhiaValue
    },

    //タイムラインのリロードフラグカウント取得
    timelineReloadLength(){
      return this.$store.state.posts.timelineNotificationFlag.length
    },

    //エラーモーダルフラグ取得
    errorModal(){
      return this.$store.state.errorMessage
    },

    //カラー情報 取得
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
  },

  watch:{
    //通知が5以上になると、リロード
    "timelineReloadLength":async function(val){
      if(val>5){
        await this.$store.dispatch('allReload')
        await firebase.database().ref('timeline/'+ firebase.auth().currentUser.uid).remove()
        this.$store.dispatch('posts/resetTimelineGetFlag')
      }
    }
  },

  created(){
    //ロード表示
    this.$store.dispatch('loadingValue','setup')

    //それぞれのデータ取得
    this.getData()

    //スクロールイベント
    window.addEventListener('scroll', this.scrollPosition)
  },

  //リアルタイム通知
  mounted(){
    firebase.database().ref('notification/'+ firebase.auth().currentUser.uid).on("child_added", snapshot => this.$store.dispatch('posts/notificationCount',snapshot.val()));
    firebase.database().ref('message/'+ firebase.auth().currentUser.uid).on("child_added", snapshot => this.$store.dispatch('messages/messageCount',snapshot.val()));
    firebase.database().ref('timeline/'+ firebase.auth().currentUser.uid).on("child_added", snapshot => this.$store.dispatch('posts/timelineGetFlag',snapshot.val()));
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

  .loading{
    min-height: calc(100vh - 4rem);
    width: 100%;
    @include flex;
    @include mainBackground;
  }

  .flex {
    min-height: calc(100vh - 4rem);
    width: 100%;
    @include flex;
    @include mainBackground;
  }

  .main_container{
    width: 800px;
    min-height: calc(100vh - 4rem);
    position: relative;
    left:256px;
  }

  .kuuhaku{
    width: calc(100% - 1056px);
    min-height:calc(100vh - 4rem);
    position: fixed;
    top: 4rem;
    left: 1056px;
    @include mainBackground;
    border-left:1px solid var(--modeBorderColor);
  }

  .detail_modal{
    z-index: 19;
    position: absolute;
    left: 256px;
    top: 0;
    width: 800px;
    min-height: calc(100vh - 4rem);
    @include mainBackground;

    &_header{
      height: 3rem;
      width: 800px;
      border-bottom: 1px solid var(--modeBorderColor);
      @include flex;
      align-items: center;
      position: fixed;
      z-index: 9;
      @include mainBackground;

      .back_button{
        margin-left: 20px;
        @include backSelectColor;
        width: 64px;
        height: 1.8rem;
        border-radius: 10px;
        @include flexCenter;

        img{
          width: 20px;
          height: 20px;
        }

        p{
          margin-left: 2px;
          margin-top: 2px;
          color: #000000;
          font-weight: bold;
        }
        
        &:hover{
          @include hoverCursor;
          @include hoverColor;
        }
      }
    }

    &__wrapper{
      min-height: calc(100vh - 4rem);
    }

    &_contents{
      position: absolute;
      top: 3rem;
      min-height: calc(100vh - 7rem);
      width: 800px;
    }

    &_contents.dontExist{
      display: flex;
      justify-content:center;
      align-items: center;
    }
  }

  .medhia_overlay {
    z-index: 99;
    position: fixed;
    top: 4rem;
    left: 0;
    width: 100%;
    height: calc(100vh - 4rem);
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    .medhia_modal{
      height: 90%;
      width: 90%;
      display: flex;
      justify-content: center;
      align-items: center;

      img{
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
      }

      video{
        max-width: 80%;
        max-height: 80%;
        object-fit: cover;
      }
    }
  }

  .error_overlay {
    z-index: 999;
    position: fixed;
    top: 4rem;
    left: 0;
    width: 100%;
    height: calc(100vh - 4rem);
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;

    .error_modal{
      width: 700px;
      height: 200px;
      background: rgb(162, 18, 18);
      display:flex;
      flex-direction: column;
      border-radius:10px;

      &_header{
        width: 100%;
        height: 40px;
        display:flex;
        justify-content: flex-end;
        align-items:center;
        border-bottom: 1px solid #000000;

        .close_button{
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          .close{
            width: 26px;
            height: 26px;
            margin :auto;
          }
          .close_hover{
            width: 26px;
            height: 26px;
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
      }
      
      &_contents{
        height: 170px;
        display:flex;
        justify-content: center;
        align-items:center;
        img{
          width: 30px;
          height: 30px;
          margin-right:10px;
        }
      }

      &_message{
        max-width: 600px;
        p{
          color:#ffffff;
          font-weight: bold;
        }
      }
    }
  }
</style>