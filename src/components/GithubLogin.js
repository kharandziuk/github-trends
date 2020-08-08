import GitHubLogin from 'react-github-login'

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Fab, Typography } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'

// FIXME: encapsulate it
const styles = (theme) => ({
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
})

class StyledGitHubLogin extends GitHubLogin {
  render() {
    const { classes } = this.props

    return (
      <>
        <Fab onClick={this.onBtnClick} color="primary" variant="extended">
          <Typography className={classes.wrapIcon}>
            <GitHubIcon className={classes.extendedIcon} />
          </Typography>
          Login
        </Fab>
      </>
    )
  }
}

export default withStyles(styles)(StyledGitHubLogin)
