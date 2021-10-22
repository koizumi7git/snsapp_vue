<template>
  <div id="app">
    <Header></Header>
    <div class="contents">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import firebase from 'firebase'

export default ({
  components: {
    Header
  },

  created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$store.dispatch("setloginUser", 'login')
        } else {
          this.$store.dispatch("deleteLoginUser")
        }
      });
    },
})
</script>


<style lang="scss">
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.contents{
  position: relative;
  top: 4rem;
  min-height:calc(100vh - 4rem);
}

img{
  user-select: none;
}

</style>
