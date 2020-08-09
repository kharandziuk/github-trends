import React from 'react'
import ReposGrid from './components/ReposGrid'
import Copyright from './components/Copyright'
import Header from './components/Header'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { Container, Box, Grid } from '@material-ui/core'

export default () => {
  return (
    <Container>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Header />
        </Grid>
        <Grid item>
          <ReposGrid />
        </Grid>
      </Grid>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
