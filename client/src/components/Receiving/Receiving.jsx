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

const api = axios.create({baseURL: 'http://localhost:3000/'});

const Receiving = () => {

   const refreshInventory = () => {
      api.get('customer_interaction/inventory/all')
         .then(res => {
            setInventoryData(res.data)
         })
         .catch(error => {
            console.log("Error")
         });
   };
   const refreshParts = () => {
      api.get('parts/all')
         .then(res => {
            setPartsData(res.data)
         })
         .catch(error => {
            console.log("Error")
         });
   };
   // refresh tables
   useEffect(refreshInventory, []);
   useEffect(refreshParts, []);

   const inventoryColumns = [
      {title: "Number", field: "number", width: "1/4"},
      {title: "Quantity", field: "quantity"}
   ];

   const partsColumns = [
      {title: "Number", field: "number", width: "1/4"},
      {title: "Description", field: "description"},
      {title: "Price", field: "price"},
      {title: "Weight", field: "weight"},
      {title: "Picture URL", field: "pictureURL"}
   ];

   // customer_interaction.inventory
   const [inventoryData, setInventoryData] = useState([]); 
   // csci467.parts
   const [partsData, setPartsData] = useState([]);
   const [iserror, setIserror] = useState(false);
   const [errorMessages, setErrorMessages] = useState([]);

   const classes = useStyles();
   let partIdRef = useRef(null);
   let quantityRef = useRef(null);

   const OnSubmit = async () => {

      let partId = partIdRef.current.value;
      let quantity = quantityRef.current.value;
      let partNumber = 0;
      let found = false;
      const getLen = (response) => ( Object.keys(response.data).length );

      // aquire the number from csci467.parts
      // if a number is given
      if (/^\d+$/.test(partId)) {
         try {
            let response = await api.get(`parts/select/${partId}`);
            if ((found = getLen(response) === 1)) {
               partNumber = partId;
            }
         } catch (error) {
            console.error(error);
         }
      // consider anything else to be a description
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

      // if the part number exists
      if (found) {
         try {
            var response = await api
               .get(`customer_interaction/inventory/select/${partNumber}`);
         } catch (error) {
            console.error(error);
         }
         // if that number exists in customer_interaction.inventory
         if (response.data[0]) {
            api.put('customer_interaction/inventory/update', {
               number: partNumber,
               quantity: quantity
            }).then((response) => {
               console.log(response);
            }).catch((error) => {
               console.error(error);
            });
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
