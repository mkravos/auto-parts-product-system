import TextField from '@material-ui/core/TextField';
import React, { useRef } from 'react';
import useStyles from './styles';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import Navbar from '../Navbar/Navbar';

const api = axios.create({baseURL: 'http://localhost:3000/'});

const Receiving = () => {

   const classes = useStyles();
   let partIdRef = useRef(null);
   let quantityRef = useRef(null);

   const onClick = async () => {

      let partId = partIdRef.current.value;
      let quantity = quantityRef.current.value;
      let partNumber = 0;
      let found = false;
      const getLen = (response) => ( Object.keys(response.data).length );

      if (!(/^\d+$/.test(partId))) {
         try {
            let response = await api.get(`parts/select/description/${partId}`); 
            if ((found = getLen(response) === 1)) {
               partNumber = response.data[0].number;
            }
         } catch (error) {
            console.error(error);
         }
      } else {
         try {
            let response = await api.get(`parts/select/${partId}`);
            if ((found = getLen(response) === 1)) {
               partNumber = partId;
            }
         } catch (error) {
            console.error(error);
         }
      }
      // if that number exists in csci467.parts
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
      } else {
         // message part number doesnt exist
      }
   };
    
   return (
      <main>
         <Navbar/>
         <h1>Receiving</h1>
         <div>
            <form className={classes.root}>
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
            <button onClick={onClick}>
               Submit
            </button>
         </div>
      </main>
   );
};

export default Receiving;
