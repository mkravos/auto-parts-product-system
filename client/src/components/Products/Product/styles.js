import { makeStyles } from '@material-ui/core/styles';

/*
* Contains the style for the Product.
*/
export default makeStyles(() => ({
    root: {
        maxWidth: '100%'
    },
    media: {
      height: "6px",
      marginLeft: "115px",
      paddingLeft: "52%",
      paddingTop: "56.25%", // 16:9,
      marginTop: "20px",
      width: "6px"
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
    },
}))