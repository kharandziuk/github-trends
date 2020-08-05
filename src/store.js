import { createStore, action, thunk } from 'easy-peasy'
import _ from 'lodash'

import getData from './DAL'

const initialState = {
  items: [],
  page: 1,
  languages: [],
}

const repos = {
  ...initialState,
  getRepos: thunk(async (actions, payload, { getState }) => {
    const { page } = getState()
    const repos = await getData(page)
    actions.incrementPage()
    actions.appendRepos(repos)
  }),
  appendRepos: action((state, repos) => {
    state.items = state.items.concat(repos)
    state.languages = _.compact(_.uniq(state.items.map((x) => x.language)))
  }),
  incrementPage: action((state) => {
    state.page = state.page + 1
  }),
}
const model = { repos }

const store = createStore(model)

export default store
