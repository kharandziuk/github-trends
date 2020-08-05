import React, { useState, useEffect} from 'react';
import logo from './logo.svg'; import './App.css';
import Avatar from '@material-ui/core/Avatar';
import { Button, ButtonGroup } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Autocomplete } from '@material-ui/lab'

import { useStoreActions, useStoreState } from 'easy-peasy';

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
  );
}

const useStyles = makeStyles((theme) => ({
    wrapIcon: {
          verticalAlign: 'middle',
          display: 'inline-flex'
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
}));

function ComplexGrid(props) {
    const classes = useStyles();

    return (

            <Paper className={classes.paper}>
              <Grid container spacing={1}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                    <Avatar alt={props.owner.login} src={props.owner.avatar_url} className={classes.large}/>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1">
                        {props.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {props.description}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" style={{ cursor: 'pointer' }} className={classes.wrapIcon}>
                        {props.stargazers_count}
                        <StarIcon fontSize="small"/>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <ButtonBase>
                      <StarBorderIcon fontSize="large"/>
                    </ButtonBase>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
        );
}


const isBottom = (el) => {
    return el.getBoundingClientRect().bottom <= window.innerHeight + 1;
}
const trackScrolling = (action) => {
    const wrappedElement = document.getElementById('root');
    if (isBottom(wrappedElement)) {
      action()
    }
};

const ReposGrid = ({repos}) => {
  return <Grid container spacing={1}>
    {
      repos.map((l, i) =>(
        <Grid xs={4} item key={i} >
        <ComplexGrid {...l}/>
        </Grid>)
      )
    }
    </Grid>
}

const LanguageSelect = ({languages}) => {
  const classes = useStyles()
  return <Grid item xs={12}>
      <Paper className={classes.paper}>
      <form className={classes.root} noValidate autoComplete="off">
    <Autocomplete
    id="combo-box-demo"
    options={languages}
    renderInput={(params) =>
        <TextField {...params} elevation={3} id="outlined-basic" label="language" variant="outlined" fullWidth={true}/>
    }
  />
      </form>
    </Paper>
  </Grid>
}

function App() {
  const repos = useStoreState(state => state.repos.items)
  const languages = useStoreState(state => state.repos.languages)
  const getRepos = useStoreActions(actions => actions.repos.getRepos)
  useEffect(() => {
    getRepos()
    const scrollingHandler = () => trackScrolling(getRepos)
    document.addEventListener('scroll', scrollingHandler);
    return () => {
      document.removeEventListener('scroll', scrollingHandler);
    }
  }, []);

  const classes = useStyles()
  return (
    <Container className={classes.root}>
      <CssBaseline/>
      <Grid container spacing={1}>
      <LanguageSelect {...{languages}}/>
      <ReposGrid {...{repos}}/>
      </Grid>
      <Box mt={8}>
      <Copyright />
      </Box>
    </Container>
  );
}

export default App;
