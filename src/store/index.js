import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import _ from 'lodash';

const projectKey = location.pathname.split('/')[1].split('-').slice(1).join('-');
const fullscreenKey = `${ projectKey }-isFullscreen`;
import wishesTypes from '../assets/wishesTypes.json';
import { vuexMinisModule as minisModule, persistedMinis } from '@minis-core/mixins';

const store = {};
Vue.use(Vuex);

store.state = () => ({
  [fullscreenKey]: false,
  switchFullscreenKey: `switch_${fullscreenKey}`,
  projectKey,
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
  isFullscreen: state => state[fullscreenKey],

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
  [`switch_${fullscreenKey}`]: state => Vue.set(state, fullscreenKey, !state[fullscreenKey]),
  changeWishType: (state, type) => Vue.set(state, 'wishType', type),
  changeWish: (state, wish) => Vue.set(state, 'changedWish', wish),
  addWishesByLang(state, { wishes, lang }) {
    if(_.size(state.wishes[lang])) return;
    Vue.set(state.wishes, lang, wishes);
  }
};


const persistedLocal = [
  fullscreenKey,
  'wishType', 
  'changedWish',
];
store.modules = { minis: minisModule };
store.plugins = [
  createMutationsSharer({ predicate: () => [...persistedMinis, ...persistedLocal] }),
  createPersistedState({ paths: persistedMinis, key: 'minis' }),
  createPersistedState({ paths: persistedLocal, key: `minis-${projectKey}` }),
];

export default new Vuex.Store(store);