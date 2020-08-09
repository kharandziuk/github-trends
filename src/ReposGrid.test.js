import React from 'react'
import { render } from '@testing-library/react'
import Page from './components/ReposGrid'
import { StoreProvider, createStore } from 'easy-peasy'

//FIXME: create factories for test data
const user = {
  token: null,
  user: null,
  stars: [],
}

const repos = {
  displayRepos: [
    {
      owner: {},
    },
    {
      owner: {},
    },
  ],
  page: 1,
  languages: [],
  languageFilter: null,
}

const store = createStore(
  {
    user,
    repos,
  },
  {
    disableImmer: true,
  },
)

test('renders smoke', () => {
  const query = render(
    <StoreProvider store={store}>
      <Page />
    </StoreProvider>,
  )
  const elements = query.getAllByText('Learn More')
  expect(elements.length).toEqual(2)
})
