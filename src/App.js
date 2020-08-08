import React, { useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import { Button, ButtonBase } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import { Autocomplete } from '@material-ui/lab'
import GithubLogin from './components/GithubLogin'

import { useStoreActions, useStoreState } from 'easy-peasy'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    margin: 'auto',
  },
  image: {
    width: 128,
    height: 128,
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

// FIXME: rename
function ComplexGrid(props) {
  const classes = useStyles()
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={1}>
        <Grid item>
          <ButtonBase className={classes.image}>
            <Avatar
              alt={props.owner.login}
              src={props.owner.avatar_url}
              className={classes.large}
            />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography
                textoverflow="ellipsis"
                gutterBottom
                variant="subtitle1"
                style={{ height: '1.5em', overflow: 'hidden' }}
              >
                {props.name}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                style={{ height: '120px' }}
              >
                {props.description}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                style={{ cursor: 'pointer' }}
                className={classes.wrapIcon}
              >
                {props.stargazers_count}
                <StarIcon fontSize="small" />
                <Link href={props.url}>Repo</Link>
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <ButtonBase>
              <StarBorderIcon fontSize="large" />
            </ButtonBase>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
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

const ReposGrid = ({ repos }) => {
  return (
    <Grid container spacing={1}>
      {repos.map((l, i) => (
        <Grid xs={4} item key={i}>
          <ComplexGrid {...l} />
        </Grid>
      ))}
    </Grid>
  )
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
  const getRepos = useStoreActions((actions) => actions.repos.getRepos)
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
        <ReposGrid {...{ repos }} />
      </Grid>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default App
