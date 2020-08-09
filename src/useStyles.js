import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
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
