import { createStore, createTypedHooks, action, thunk } from 'easy-peasy'
import storage from 'redux-persist/lib/storage'
import _ from 'lodash'

import getData from './DAL';

const initialState = {
  items: [ ],
  page: 1
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
  }),
  incrementPage: action((state) => {
    state.page = state.page + 1
  }),
}
const model = { repos }


const store = createStore(model)

export default store
