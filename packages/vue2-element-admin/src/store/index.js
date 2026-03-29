import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
    openedTabs: [],
    cachedViews: [],
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    ADD_TAB(state, tab) {
      if (!state.openedTabs.some((t) => t.path === tab.path)) {
        state.openedTabs.push(tab);
      }
    },
    REMOVE_TAB(state, path) {
      state.openedTabs = state.openedTabs.filter((t) => t.path !== path);
    },
    SET_OPENED_TABS(state, tabs) {
      state.openedTabs = tabs;
    },
    ADD_CACHED_VIEW(state, view) {
      if (!state.cachedViews.includes(view)) {
        state.cachedViews.push(view);
      }
    },
    REMOVE_CACHED_VIEW(state, view) {
      state.cachedViews = state.cachedViews.filter((v) => v !== view);
    },
    SET_CACHED_VIEWS(state, views) {
      state.cachedViews = views;
    },
  },
  actions: {
    login({ commit }, userInfo) {
      const { username, password } = userInfo;
      // 模拟登录
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('SET_USER', { username });
          commit('SET_TOKEN', 'mock-token-' + Date.now());
          resolve();
        }, 1000);
      });
    },
    logout({ commit }) {
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      commit('SET_OPENED_TABS', []);
      commit('SET_CACHED_VIEWS', []);
    },
  },
  getters: {
    user: (state) => state.user,
    token: (state) => state.token,
    openedTabs: (state) => state.openedTabs,
    cachedViews: (state) => state.cachedViews,
  },
});
