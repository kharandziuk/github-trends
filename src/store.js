import { createStore, action, thunk } from 'easy-peasy'
import _ from 'lodash'

import { getData, getLanguages } from './DAL'

const initialState = {
  items: [],
  page: 1,
  languages: [],
  languageFilter: null,
}

const repos = {
  ...initialState,
  getRepos: thunk(async (actions, { page, language } = {}, { getState }) => {
    console.log(page, language)
    const state = getState()
    page = page || state.page
    const languageFilter = language || state.languageFilter
    if (page === 1) {
      actions.updateState({
        items: [],
      })
    }
    const repos = await getData({ page, language: languageFilter })
    actions.updateState({
      page: page + 1,
      languageFilter,
    })
    actions.appendRepos(repos)
  }),
  getLanguages: thunk(async (actions, payload) => {
    const languages = await getLanguages()
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
  }),
}
const model = { repos }

const store = createStore(model)

store.getActions().repos.getLanguages()

export default store
