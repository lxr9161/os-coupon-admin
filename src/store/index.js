import Vue from 'vue'
import Vuex from 'vuex'
import meeting from './modules/meeting'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    meeting,
    user
  }
})
