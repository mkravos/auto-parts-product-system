import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import Navbar from '../Navbar/Navbar';
import NumberFormat from 'react-number-format';
import React, { useRef, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import useStyles from './styles';
import { Grid } from '@material-ui/core';
import { forwardRef } from 'react';

import Alert from '@material-ui/lab/Alert';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
   ArrowDownwardIcon: forwardRef((props, ref) => <ArrowDownwardIcon {...props} ref={ref} />),
   Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
   Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
   DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
   Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
   FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
   LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
   NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
   PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
   ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
   Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
   SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
   ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
   ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

// we use this object to do CRUD operations on customer_interaction_db
// by interfacing with the server at baseURL which contains functions
// to do what we want
const api = axios.create({baseURL: 'http://localhost:3000/'});

// main react function for this file
const Receiving = () => {

   const [inventoryData, setInventoryData] = useState([]); 
   const [partsData, setPartsData] = useState([]);
   // the following do not refresh the view which displays the data
   //
   // refresh client data with rows from customer_interaction_db.inventory
   const refreshInventory = () => {
      api.get('customer_interaction/inventory/all')
         .then(res => {
            setInventoryData(res.data)
         })
         .catch(error => {
            console.log("Error")
         });
   };
   // refresh client data with rows from csci467.parts
   const refreshParts = () => {
      api.get('parts/all')
         .then(res => {
            setPartsData(res.data)
         })
         .catch(error => {
            console.log("Error")
         });
   };

   // set the refresh functions to be used on refresh of the page
   useEffect(refreshInventory, []);
   useEffect(refreshParts, []);

   // corresponds with customer_interaction_db.inventory
   const inventoryColumns = [
      {title: "Number", field: "number", width: "1/4"},
      {title: "Quantity", field: "quantity"}
   ];

   // corresponds with csci467.parts
   const partsColumns = [
      {title: "Number", field: "number", width: "1/4"},
      {title: "Description", field: "description"},
      {title: "Price", field: "price"},
      {title: "Weight", field: "weight"},
      {title: "Picture URL", field: "pictureURL"}
   ];

   const [iserror, setIserror] = useState(false);
   const [errorMessages, setErrorMessages] = useState([]);

   // cosmetics
   const classes = useStyles();
   // the refs allow access to data entered in a form etc.
   //
   // here we use reacts useRef
   let partIdRef = useRef(null);
   let quantityRef = useRef(null);

   // executed when one clicks the submit button
   //
   // starts with capital letter just in case certain react
   // features are put into place
   const OnSubmit = async () => {

      // extract the main values we want from the user
      let partId = partIdRef.current.value;
      let quantity = quantityRef.current.value;

      // we will find the corresponding part number if a valid description is 
      // given in partId, else partNumber will be set to a valid part number
      // if given
      let partNumber = 0;
      // determined by a valid part number
      let found = false;
      // will tell us if a partId exists in the databases we are using
      const getLen = (response) => ( Object.keys(response.data).length );

      // aquire the number from csci467.parts
      //
      // a number is given
      if (/^\d+$/.test(partId)) {
         try {
            let response = await api.get(`parts/select/${partId}`);
            if ((found = getLen(response) === 1)) {
               partNumber = partId;
            }
         } catch (error) {
            console.error(error);
         }
      // a description is given
      } else {
         try {
            partId = encodeURIComponent(partId);
            let response = await api.get(`parts/select/description/${partId}`);
            if ((found = getLen(response) === 1)) {
               partNumber = response.data[0].number;
            }
         } catch (error) {
            console.error(error);
         }
      }

      // the partNumber was able to be determined from the user provided
      // partId
      if (found) {
         try {
            var response = await api
               .get(`customer_interaction/inventory/select/${partNumber}`);
         } catch (error) {
            console.error(error);
         }
         // partNumber exists in customer_interaction_db.inventory
         if (response.data[0]) {
            api.put('customer_interaction/inventory/update', {
               number: partNumber,
               quantity: quantity
            }).then((response) => {
               console.log(response);
            }).catch((error) => {
               console.error(error);
            });
         // add partNumber to a new row since it does not exist there
         } else {
            api.post('customer_interaction/inventory/create', {
               number: partNumber,
               quantity: quantity
            }).then((response) => {
               console.log(response);
            }).catch((error) => {
               console.error(error);
            });
         }
      }
   };
    
   return (
      <main>
         <Navbar/>
         <div className={classes.div}>
            <center><h1>Receiving</h1></center>
            <center>
               <form className={classes.form}>
                  <TextField
                     label="Part Number or Description"
                     defaultValue="0"
                     inputRef={partIdRef}
                     className={classes.textField} />
                  <NumberFormat
                     customInput={TextField} 
                     label="Quantity"
                     defaultValue="1"
                     inputRef={quantityRef}
                     className={classes.textField} />
               </form>
               <Button onClick={OnSubmit}>
                  Submit
               </Button>
               <Grid className={classes.grid} container spacing={1}>
                  <center>
                     <Grid item xs={6}>
                     <div>
                        {
                           iserror && 
                           <Alert severity="error">
                           {
                              errorMessages.map((msg, i) => {
                                 return <div key={i}>{msg}</div>
                              })
                           }
                           </Alert>
                        }       
                     </div>
                     <MaterialTable
                        title="Inventory"
                        columns={inventoryColumns}
                        data={inventoryData}
                        icons={tableIcons}
                        options={{
                           tableLayout: 'fixed',
                           headerStyle: {
                              backgroundColor: '#efefef',
                              fontWeight: 'bold',
                           },
                           rowStyle: {
                              backgroundColor: '#a2d8e8',
                           }
                        }}
                     />
                     </Grid>
                  </center>
               </Grid>
               <Grid className={classes.grid} container spacing={1}>
                  <center>
                     <Grid item xs={6}>
                     <div>
                        {
                           iserror && 
                           <Alert severity="error">
                           {
                              errorMessages.map((msg, i) => {
                                 return <div key={i}>{msg}</div>
                              })
                           }
                           </Alert>
                        }       
                     </div>
                     <MaterialTable
                        title="Parts"
                        columns={partsColumns}
                        data={partsData}
                        icons={tableIcons}
                        options={{
                           tableLayout: 'fixed',
                           headerStyle: {
                              backgroundColor: '#efefef',
                              fontWeight: 'bold',
                           },
                           rowStyle: {
                              backgroundColor: '#a2d8e8',
                           }
                        }}
                     />
                     </Grid>
                  </center>
               </Grid>
            </center>
         </div>
      </main>
   );
};

export default Receiving;
