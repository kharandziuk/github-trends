import { createStore, createTypedHooks, action, thunk } from 'easy-peasy'
import storage from 'redux-persist/lib/storage'
import _ from 'lodash'

import getData from './DAL';

const initialState = {
  items: [ ],
}

const repos = {
  ...initialState,
  getRepos: thunk(async (actions) => {
    const repos = await getData()
    actions.appendRepos(repos)
  }),
  appendRepos: action((state, repos) => {
    state.items = state.items.concat(repos)
  }),
}
const model = { repos }

const { useStoreActions, useStoreState } = createTypedHooks()

const store = createStore(model)

export { useStoreActions, useStoreState }

export default store
