import React from 'react'
import { render } from '@testing-library/react'
import App from './App'
import { StoreProvider } from 'easy-peasy'
import store from './store'

test('renders smoke', () => {
  const { getByText } = render(
    <StoreProvider store={store}>
      <App />
    </StoreProvider>,
  )
  const linkElement = getByText(/kharandziuk/i)
  expect(linkElement).toBeInTheDocument()
})
