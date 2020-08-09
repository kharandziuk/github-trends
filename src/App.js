import React, { useEffect } from 'react'
import Page from './Page'

import { useStoreActions } from 'easy-peasy'

const isBottom = (el) => {
  return el.getBoundingClientRect().bottom <= window.innerHeight + 1
}

const trackScrolling = (action) => {
  const wrappedElement = document.getElementById('root')
  if (isBottom(wrappedElement)) {
    action()
  }
}

const App = () => {
  const fetchRepos = useStoreActions((actions) => actions.repos.fetch)
  const fetchStars = useStoreActions((actions) => actions.user.fetchStars)
  useEffect(() => {
    fetchRepos()
    fetchStars()
    const scrollingHandler = () => trackScrolling(fetchRepos)
    document.addEventListener('scroll', scrollingHandler)
    return () => {
      document.removeEventListener('scroll', scrollingHandler)
    }
  }, [fetchRepos, fetchStars])

  return <Page />
}

export default App
