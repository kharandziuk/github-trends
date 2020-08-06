import GitHubLogin from 'react-github-login'

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Fab } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'

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
      <Fab
        onClick={this.onBtnClick}
        color="primary"
        variant="extended"
        className={classes.margin}
      >
        <GitHubIcon className={classes.extendedIcon} />
        Login
      </Fab>
    )
  }
}

export default withStyles(styles)(StyledGitHubLogin)
