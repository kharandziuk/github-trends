import { createStore, action, thunk, computed } from 'easy-peasy'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import * as service from './DAL'
import _ from 'lodash'

const initialState = {
  items: [],
  page: 1,
  languages: [],
  languageFilter: null,
  token: null,
  user: null,
  starredRepos: [],
}

const repos = {
  ...initialState,
  displayRepos: computed(
    [(state) => state.items, (state, storeState) => storeState.user.stars],
    (items, starredRepos) => {
      return items.map((x) =>
        starredRepos.includes(x.full_name)
          ? { ...x, isStarred: true }
          : { ...x, isStarred: false },
      )
    },
  ),
  fetch: thunk(async (actions, { page, language } = {}, { getState }) => {
    const state = getState()
    page = page || state.page
    if (page === 1) {
      actions.updateState({
        items: [],
      })
    }
    const repos = await service.getRepos({ page, language })
    actions.updateState({
      page: page + 1,
      languageFilter: language,
    })
    actions.appendRepos(repos)
  }),
  getLanguages: thunk(async (actions, payload) => {
    const languages = await service.getLanguages()
    actions.setLanguages(languages)
  }),
  setLanguages: action((state, languages) => {
    state.languages = languages
    return state
  }),
  appendRepos: action((state, repos) => {
    state.items = state.items.concat(repos)
    return state
  }),
  updateState: action((state, newState) => {
    state = Object.assign({}, state, newState)
    return state
  }),
}

const user = {
  token: null,
  user: null,
  stars: [],
  isLogged: computed([(state) => state.user], (user) => !_.isNull(user)),
  login: thunk(async (actions, { code }) => {
    const token = (await service.getToken(code)).access_token
    const user = await service.getProfile(token)
    actions.updateState({ user, token })
    actions.fetchStars()
  }),
  makeLogout: thunk((actions) => {
    actions.updateState({ user: null, token: null, stars: [] })
  }),
  fetchStars: thunk(async (actions, payload, { getState }) => {
    const { user, token } = getState()
    let page = 1
    let stars = []
    // gets all the pages
    while (true) {
      const starsPage = await service.getStarredRepos(token, page)
      stars = stars.concat(starsPage)
      page = page + 1
      // if page empty: break the loop
      if (!Boolean(starsPage.length)) {
        break
      }
    }
    console.log(stars)
    actions.updateState({
      stars,
    })
  }),
  starRepo: thunk(async (actions, { repo } = {}, { getState }) => {
    const { token, stars } = getState()
    service.starRepo(repo, token)
    actions.updateState({
      stars: _.union(stars, [repo]),
    })
  }),
  unstarRepo: thunk(async (actions, { repo } = {}, { getState }) => {
    const { token, stars } = getState()
    service.unstarRepo(repo, token)
    actions.updateState({
      stars: _.difference(stars, [repo]),
    })
  }),
  updateState: action((state, newState) => {
    state = Object.assign({}, state, newState)
    return state
  }),
}

const model = { repos, user }

const store = createStore(model, {
  disableImmer: true,
  reducerEnhancer: (reducer) =>
    persistReducer(
      {
        key: 'root',
        storage,
        stateReconciler: autoMergeLevel2,
      },
      reducer,
    ),
})

const persistor = persistStore(store)

store.getActions().repos.getLanguages()
export { persistor }

export default store
