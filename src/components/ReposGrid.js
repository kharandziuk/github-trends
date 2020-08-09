import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Button } from '@material-ui/core'
import {
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  CardContent,
} from '@material-ui/core'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import _ from 'lodash'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

import { useStoreState, useStoreActions } from 'easy-peasy'

const StarButton = (props) => {
  const unstarRepo = useStoreActions((actions) => actions.user.unstarRepo)
  const starRepo = useStoreActions((actions) => actions.user.unstarRepo)
  let content
  if (_.isUndefined(props.isStarred)) {
    return <></>
  } else if (props.isStarred) {
    content = <StarIcon onClick={() => unstarRepo({ repo: props.full_name })} />
  } else if (!props.isStarred) {
    content = (
      <StarBorderIcon onClick={() => starRepo({ repo: props.full_name })} />
    )
  }
  return (
    <Button size="small" color="primary">
      {content}
    </Button>
  )
}

const RepoCard = (props) => {
  const isLogged = useStoreState((state) => state.user.isLogged)
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
            {props.name} <StarIcon fontSize="small" />
            {props.stargazers_count}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {isLogged ? <StarButton {...props} /> : null}
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
