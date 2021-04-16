import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
   div: {
      position: "relative",
      top: "100px"
   },
   form: {
      padding: "30px"
   },
   textField: {
      '& > *': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   grid: {
      padding: "30px"
   }
}));

export default useStyles
