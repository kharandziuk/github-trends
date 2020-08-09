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
    [(state) => state.items, (state) => state.starredRepos],
    (items, starredRepos) => {
      return items.map((x) =>
        starredRepos.includes(x.full_name)
          ? { ...x, isStarred: true }
          : { ...x, isStarred: false },
      )
    },
  ),
  getRepos: thunk(async (actions, { page, language } = {}, { getState }) => {
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
    actions.getStars(repos)
  }),
  starRepo: thunk(async (actions, { repo } = {}, { getState }) => {
    const { token, user, starredRepos } = getState()
    if (!user) {
      return
    }
    service.starRepo(repo, token)
    // HACK: to make the star visible
    actions.updateState({
      starredRepos: _.union(starredRepos, [repo]),
    })
  }),
  unstarRepo: thunk(async (actions, { repo } = {}, { getState }) => {
    const { token, user, starredRepos } = getState()
    if (!user) {
      return
    }
    service.unstarRepo(repo, token)
    // HACK: to make the star visible
    actions.updateState({
      starredRepos: _.difference(starredRepos, [repo]),
    })
  }),
  getStars: thunk(async (actions, payload, { getState }) => {
    const { user, token } = getState()
    if (!user) {
      return
    }
    let flag = true
    let page = 1
    let allStarred = []
    while (flag) {
      const starredPage = await service.getStarredRepos(token, page)
      allStarred = allStarred.concat(starredPage)
      page = page + 1
      flag = Boolean(starredPage.length)
    }
    actions.updateState({
      starredRepos: allStarred,
    })
  }),
  makeLogout: thunk((actions) => {
    actions.updateState({ user: null, token: null })
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
    state.items = state.items.map((x) =>
      state.starredRepos.includes(x.full_name)
        ? { ...x, isStarred: true }
        : { ...x, isStarred: false },
    )
    return state
  }),
}

const user = {
  token: null,
  user: null,
  stars: [],
  login: thunk(async (actions, { code }) => {
    const token = (await service.getToken(code)).access_token
    const user = await service.getProfile(token)
    actions.updateState({ user, token })
    actions.getStars()
  }),
  getStars: thunk(async (actions, payload, { getState }) => {
    const { user, token } = getState()
    if (!user) {
      return
    }
    let flag = true
    let page = 1
    let allStarred = []
    while (flag) {
      const starredPage = await service.getStarredRepos(token, page)
      allStarred = allStarred.concat(starredPage)
      page = page + 1
      flag = Boolean(starredPage.length)
    }
    actions.updateState({
      starredRepos: allStarred,
    })
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
