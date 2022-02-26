import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import _ from 'lodash';

import wishes from '../assets/wishes.json';
import wishesTypes from '../assets/wishesTypes.json';
import minisModule from './minis';

const store = {};
Vue.use(Vuex);

store.state = () => ({
  wishes,
  wishesTypesList: _.shuffle(wishesTypes),
  wishType: 'prawn',
  changedWish: {
    text: null,
    type: null,
    time: null,
  },
});


store.mutations = {
  changeWishType: (state, type) => Vue.set(state, 'wishType', type),
  changeWish: (state, wish) => Vue.set(state, 'changedWish', wish),
};


const persistedMinis = [
  'minis.minisThemeMain', 'minis.minisThemeSpecial', 'minis.minisLang',
  'minis.themesJSON', 'minis.translateJSON', 'minis.minisJSON',
];
const persistedLocal = ['wishType', 'changedWish'];
const projectKey = `minis-${ location.pathname.split('/')[1] }`;
store.modules = { minis: minisModule };
store.plugins = [
  createMutationsSharer({ predicate: () => [...persistedMinis, ...persistedLocal] }),
  createPersistedState({ paths: persistedMinis, key: 'minis' }),
  createPersistedState({ paths: persistedLocal, key: projectKey }),
];

export default new Vuex.Store(store);