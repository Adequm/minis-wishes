import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import _ from 'lodash';

const projectKey = location.pathname.split('/')[1];
import wishesTypes from '../assets/wishesTypes.json';
import minisModule from './minis';

const store = {};
Vue.use(Vuex);

store.state = () => ({
  projectKey: projectKey.split('-').slice(1).join('-'),
  wishes: {},
  wishesTypes,
  wishType: 'prawn',
  changedWish: {
    textId: null,
    type: null,
    time: null,
  },
});


store.getters = {
  wishes({ wishes, minis: { minisLang } }) {
    return _.get(wishes, minisLang, []);
  },

  wishesTypes({ wishesTypes, minis: { minisLang } }) {
    return _.get(wishesTypes, minisLang, {});
  },

  wishesTypesList({}, { wishesTypes }) {
    return _.keys(wishesTypes);
    return _.shuffle(_.keys(wishesTypes));
  },

  maxWishesLength({ wishes }) {
    return _.chain(wishes)
      .mapValues(_.size)
      .values()
      .max()
      .value();
  },
};


store.mutations = {
  changeWishType: (state, type) => Vue.set(state, 'wishType', type),
  changeWish: (state, wish) => Vue.set(state, 'changedWish', wish),
  addWishesByLang(state, { wishes, lang }) {
    if(_.size(state.wishes[lang])) return;
    Vue.set(state.wishes, lang, wishes);
  }
};


const persistedMinis = [
  'minis.minisThemeMain', 'minis.minisThemeSpecial', 'minis.minisLang',
  'minis.themesJSON', 'minis.translateJSON', 'minis.minisJSON',
];
const persistedLocal = ['wishType', 'changedWish'];
store.modules = { minis: minisModule };
store.plugins = [
  createMutationsSharer({ predicate: () => [...persistedMinis, ...persistedLocal] }),
  createPersistedState({ paths: persistedMinis, key: 'minis' }),
  createPersistedState({ paths: persistedLocal, key: projectKey }),
];

export default new Vuex.Store(store);