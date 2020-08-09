import GitHubLogin from 'react-github-login'

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Fab, Typography } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'

// HACK: react-github-login doesn't support hooks.
const styles = (theme) => ({
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
})

//FIXME: On Failure case isn't handled
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
