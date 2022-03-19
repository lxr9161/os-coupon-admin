import axios from 'axios'

const state = {
  user: {}
}

const mutations = {
  USER_INFO: (state, val) => {
    state.user = val
  }
}

const actions = {
  getUserInfo ({ commit }) {
    axios.get('/backend/me').then(res => {
      if (res.data.status === 'success') {
        commit('USER_INFO', res.data)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
