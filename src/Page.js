import React from 'react'
import ReposGrid from './components/ReposGrid'
import Copyright from './components/Copyright'
import Header from './components/Header'
import useStyles from './useStyles'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { Container, Grid, Box } from '@material-ui/core'

export default () => {
  const classes = useStyles()
  const repos = useStoreState((state) => state.repos.items)
  const starRepo = useStoreActions((actions) => actions.repos.starRepo)
  return (
    <Container>
      <Header />
      <ReposGrid {...{ repos, starRepo }} />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
