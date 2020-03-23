import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex);

const store = new Vuex.Store({
  getters: {},
  actions: {},
  state: {},
  modules: { user,},
  mutations: {},
});
export default store
