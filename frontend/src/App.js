import React, { useState, useEffect} from 'react';
import logo from './logo.svg'; import './App.css';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
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
          maxWidth: 400,
        },
    image: {
          width: 128,
          height: 128,
        },
}));

function ComplexGrid(props) {
    const classes = useStyles();

    return (
          <div className={classes.root}>
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
          </div>
        );
}



function App() {
  const repos = useStoreState(state => state.repos.items)
  const getRepos = useStoreActions(actions => actions.repos.getRepos)
  useEffect(() => {
    getRepos()
  }, []);

  return (
        <Container component="main" maxWidth="xl">
          <CssBaseline />
        <Grid container spacing={1}>
          {
            repos.map((l, i) =>(
            <Grid xs={4} item key={i} >
              <ComplexGrid {...l}/>
            </Grid>)
            )
          }
        </Grid>
        <Box mt={8}>
          <Copyright />
        </Box>
        </Container>
  );
}

export default App;
