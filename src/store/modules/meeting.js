const state = {
  page: null
}

const mutations = {
  SET_PAGE: (state, val) => {
    state.page = val
  },
  CLEAR_PAGE: (state) => {
    state.page = null
  }
}

const actions = {
  pageStore ({ commit }, val) {
    commit('SET_PAGE', val)
  },
  clearPage ({ commit }) {
    commit('CLEAR_PAGE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
