import React, { useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { Button } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import GithubLogin from './components/GithubLogin'
import ReposGrid from './components/ReposGrid'
import useStyles from './useStyles'

import { useStoreActions, useStoreState } from 'easy-peasy'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link
        color="inherit"
        href="https://github.com/kharandziuk?tab=repositories"
      >
        Kharandziuk
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const isBottom = (el) => {
  return el.getBoundingClientRect().bottom <= window.innerHeight + 1
}

const trackScrolling = (action) => {
  const wrappedElement = document.getElementById('root')
  if (isBottom(wrappedElement)) {
    action()
  }
}

const UserLogout = ({ user, makeLogout }) => {
  return (
    <>
      <Button color="secondary" variant="contained" onClick={makeLogout}>
        <Avatar alt={user.login} src={user.avatar_url} />
        logout
      </Button>
    </>
  )
}

const LanguageSelect = ({
  languages,
  getRepos,
  obtainToken,
  user,
  makeLogout,
}) => {
  const classes = useStyles()
  return (
    <>
      <Grid item xs={8}>
        <form className={classes.root} noValidate autoComplete="off">
          <Autocomplete
            id="combo-box-demo"
            options={languages}
            onChange={(event, value) => {
              let language
              if (!value) {
                language = ''
              } else {
                language = value.name
              }
              getRepos({ language, page: 1 })
            }}
            getOptionLabel={(x) => x.name}
            renderInput={(params) => (
              <TextField
                {...params}
                elevation={3}
                id="outlined-basic"
                label="language"
                variant="outlined"
                fullWidth={true}
              />
            )}
          />
        </form>
      </Grid>
      <Grid item xs={4} align="right">
        {user ? (
          <UserLogout {...{ makeLogout, user }} />
        ) : (
          <GithubLogin
            clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
            redirectUri=""
            onSuccess={obtainToken}
            scope="public_repo"
          />
        )}
      </Grid>
    </>
  )
}

function App() {
  const repos = useStoreState((state) => state.repos.items)
  const languages = useStoreState((state) => state.repos.languages)
  const user = useStoreState((state) => state.repos.user)
  const getRepos = useStoreActions((actions) => actions.repos.fetch)
  const starRepo = useStoreActions((actions) => actions.repos.starRepo)
  const makeLogout = useStoreActions((actions) => actions.repos.makeLogout)
  const obtainToken = useStoreActions((actions) => actions.repos.obtainToken)
  useEffect(() => {
    getRepos()
    const scrollingHandler = () => trackScrolling(getRepos)
    document.addEventListener('scroll', scrollingHandler)
    return () => {
      document.removeEventListener('scroll', scrollingHandler)
    }
  }, [getRepos])

  const classes = useStyles()
  return (
    <Container className={classes.root}>
      <CssBaseline />
      <Grid container spacing={1}>
        <LanguageSelect
          {...{ languages, getRepos, obtainToken, user, makeLogout }}
        />
        <ReposGrid {...{ repos, starRepo }} />
      </Grid>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default App
