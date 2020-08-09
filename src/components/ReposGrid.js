import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Dotdotdot from 'react-dotdotdot'
import { Button, ButtonBase } from '@material-ui/core'
import {
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  CardContent,
} from '@material-ui/core'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import StarHalfIcon from '@material-ui/icons/StarHalf'
import _ from 'lodash'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

import useStyles from '../useStyles'
import { useStoreState, useStoreActions } from 'easy-peasy'

const StarButton = (props) => {
  const unstarRepo = useStoreActions((actions) => actions.repos.unstarRepo)
  const starRepo = useStoreActions((actions) => actions.repos.unstarRepo)
  let content
  if (_.isUndefined(props.isStarred)) {
    content = <StarHalfIcon />
  } else if (props.isStarred) {
    content = <StarIcon />
  } else if (!props.isStarred) {
    content = <StarBorderIcon />
  }
  return (
    <Button size="small" color="primary">
      {content}
    </Button>
  )
}

//const _RepoCard = (props) => {
//  const classes = useStyles()
//  return (
//    <Paper className={classes.paper}>
//      <Grid container spacing={1}>
//        <Grid item xs={4} md={4}>
//            <Img
//              alt={props.owner.login}
//              src={props.owner.avatar_url}
//              className={classes.large}
//            />
//        </Grid>
//        <Grid item xs={8} sm container>
//          <Grid item xs container direction="column" spacing={2}>
//            <Grid item xs style={{ height: '6em' }}>
//              <Typography
//                textoverflow="ellipsis"
//                gutterBottom
//                variant="subtitle1"
//                style={{ height: '1.5em', overflow: 'hidden' }}
//              >
//                <Link href={props.html_url}>{props.name}</Link>
//              </Typography>
//              <Dotdotdot clamp={4}>
//                <Typography variant="body1">{props.description}</Typography>
//              </Dotdotdot>
//            </Grid>
//            <Grid item>
//              <Typography
//                variant="body2"
//                style={{ cursor: 'pointer' }}
//                className={classes.wrapIcon}
//              >
//              </Typography>
//            </Grid>
//          </Grid>
//          <Grid item>
//            <StarButton {...props} />
//          </Grid>
//        </Grid>
//      </Grid>
//    </Paper>
//  )
//}

const RepoCard = (props) => {
  const classes = useStyles()
  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={props.owner.login}
          height="150"
          image={props.owner.avatar_url}
          title={props.owner.login}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.owner.login} <StarIcon fontSize="small" />
            {props.stargazers_count}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <StarButton />
        <Button size="small" color="primary">
          <Link href={props.html_url}>Learn More</Link>
        </Button>
      </CardActions>
    </Card>
  )
}

const ReposGrid = ({ starRepo }) => {
  const repos = useStoreState((state) => state.repos.displayRepos)
  return (
    <Grid container spacing={1}>
      {repos.map((l, i) => (
        <Grid xs={12} md={4} item key={i}>
          <RepoCard starRepo={starRepo} {...l} />
        </Grid>
      ))}
    </Grid>
  )
}
export default ReposGrid
