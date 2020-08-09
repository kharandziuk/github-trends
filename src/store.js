import { createStore, action, thunk, computed, persist } from 'easy-peasy'

import * as service from './DAL'
import _ from 'lodash'

const repos = {
  items: [],
  page: 1,
  languages: [],
  languageFilter: null,
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
    actions.updateState({
      languages,
    })
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
    const { isLogged } = getState()
    if (!isLogged) {
      return
    }
    const { token } = getState()
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
    actions.updateState({
      stars,
    })
  }),
  starRepo: thunk(async (actions, { repo } = {}, { getState }) => {
    const { token, stars } = getState()
    actions.updateState({
      stars: _.union(stars, [repo]),
    })
    service.starRepo(repo, token)
  }),
  unstarRepo: thunk(async (actions, { repo } = {}, { getState }) => {
    const { token, stars } = getState()
    actions.updateState({
      stars: _.difference(stars, [repo]),
    })
    service.unstarRepo(repo, token)
  }),
  updateState: action((state, newState) => {
    state = Object.assign({}, state, newState)
    return state
  }),
}

const model = { repos, user: persist(user) }

const store = createStore(model, {
  disableImmer: true,
})

store.getActions().repos.getLanguages()

export default store
