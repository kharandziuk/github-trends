import React from 'react'
import { Button, Grid, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import useStyles from '../useStyles'
import Avatar from '@material-ui/core/Avatar'
import GithubLogin from './GithubLogin'
import { useStoreActions, useStoreState } from 'easy-peasy'

const UserLogout = () => {
  const user = useStoreState((state) => state.user.user)
  const makeLogout = useStoreActions((actions) => actions.user.makeLogout)

  return (
    <>
      <Button color="secondary" variant="contained" onClick={makeLogout}>
        <Avatar alt={user.login} src={user.avatar_url} />
        logout
      </Button>
    </>
  )
}

const Header = () => {
  const classes = useStyles()
  const languages = useStoreState((state) => state.repos.languages)
  const getRepos = useStoreActions((actions) => actions.repos.fetch)
  const login = useStoreActions((actions) => actions.user.login)
  const isLogged = useStoreState((state) => state.user.isLogged)
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
        {isLogged ? (
          <UserLogout />
        ) : (
          <GithubLogin
            clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
            redirectUri=""
            onSuccess={login}
            scope="public_repo"
          />
        )}
      </Grid>
    </>
  )
}

export default Header
