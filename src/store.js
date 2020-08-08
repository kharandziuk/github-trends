import { createStore, action, thunk } from 'easy-peasy'

import * as service from './DAL'

const initialState = {
  items: [],
  page: 1,
  languages: [],
  languageFilter: null,
  token: null,
  user: null,
  starredRepos: new Set(),
}

const repos = {
  ...initialState,
  getRepos: thunk(async (actions, { page, language } = {}, { getState }) => {
    const state = getState()
    page = page || state.page
    if (page === 1) {
      actions.updateState({
        items: [],
      })
    }
    const repos = await service.getData({ page, language })
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
    starredRepos.add(repo)
    actions.updateState({ starredRepos })
  }),
  unstarRepo: thunk(async (actions, { repo } = {}, { getState }) => {
    const { token, user, starredRepos } = getState()
    if (!user) {
      return
    }
    service.unstarRepo(repo, token)
    // HACK: to make the star visible
    starredRepos.delete(repo)
    actions.updateState({ starredRepos })
  }),
  obtainToken: thunk(async (actions, { code }) => {
    const token = (await service.getToken(code)).access_token
    const user = await service.getProfile(token)
    actions.updateState({ user, token })
    actions.getStars()
  }),
  getStars: thunk(async (actions, payload, { getState }) => {
    const { user, token, items } = getState()
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
    const starredRepos = new Set(allStarred)
    actions.updateState({
      starredRepos,
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
  }),
  appendRepos: action((state, repos) => {
    state.items = state.items.concat(repos)
  }),
  updateState: action((state, newState) => {
    state = Object.assign(state, newState)
    state.items = state.items.map((x) =>
      state.starredRepos.has(x.full_name)
        ? { ...x, isStarred: true }
        : { ...x, isStarred: false },
    )
  }),
}

const model = { repos }

const store = createStore(model)

store.getActions().repos.getLanguages()

export default store
