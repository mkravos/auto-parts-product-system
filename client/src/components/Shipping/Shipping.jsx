// Require needed libraries.
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';

// Require for material table.
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Alert from '@material-ui/lab/Alert';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

// Require for navigation bar.
import Navbar from '../Navbar/Navbar';

// Get all table icons that will be used.
const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    ArrowDownwardIcon: forwardRef((props, ref) => <ArrowDownwardIcon {...props} ref={ref} />)
};

// API to handle interacting and fetching data from server.
const api = axios.create({baseURL: 'http://localhost:3000'});

const Shipping = () => {
    // Define columns.
    const columns = [
        {title: "Order ID", field: "order_id", width: "1/4", editable: 'never'},
        {title: "Customer ID", field: "customer_id", editable: 'never'},
        {title: "Weight", field: "weight", editable: 'never'},
        {title: "Shipping", field: "shipping", editable: 'never'},
        {title: "Handling", field: "handling", editable: 'never'},
        {title: "Total Charge", field: "charge_total", editable: 'never'},
        {title: "Order Date", field: "order_date", editable: 'never'},
        {title: "Status", field: "status"},
    ]

    // Table data.
    const [data, setData] = useState([]);

    // For error handling.
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    // Function that fetches data from the database.
    // Sets the data to be displayed.
    useEffect(() => {
        api.get('/customer_interaction/order/all')
            .then(res => {
                setData(res.data)
            })
            .catch(error=>{
                console.log("Error")
            })
    }, [])

    // Function that handles updating a current order's status.
    // Takes in new/old order data and updates the table.
    // Does not return anything.
    const handleRowUpdate = (newData, oldData, resolve) => {
        // Validate input.
        let errorList = []
        if(newData.status === ""){
            errorList.push("Please enter order status.")
        }

        // If no errors, proceed with updating order on database.
        if(errorList.length < 1){
            api.put('/customer_interaction/order/update', newData)
                .then(res => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve()
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Update failed! Server error"])
                    resolve()
                })
        }
        else{
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }
    }

    // Function that handles deleting orders.
    // Takes in old order data to locate the row to delete.
    // Does not return anything.
    const handleRowDelete = (oldData, resolve) => {
        api.delete("/customer_interaction/order/delete/"+oldData.order_id)
        .then(res => {
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            resolve()
        })
        .catch(error => {
            setErrorMessages(["Delete failed! Server error"])
            resolve()
        })
    }

    // Function that creates a .csv file containing the selected order that is automatically downloaded.
    // Takes in the order information for specific row.
    // Does not return anything.
    const handleClick = (rowData) => {
        // Create string for .csv file.
        let text = '';
        for(let i = 0; i < columns.length; i++){
            text += '"'+columns[i].title+'",';
        }
        text = text.slice(0,-1);
        text += '\n';
        text += '"'+rowData.order_id+'",';
        text += '"'+rowData.customer_id+'",';
        text += '"'+rowData.weight+'",';
        text += '"'+rowData.shipping+'",';
        text += '"'+rowData.handling+'",';
        text += '"'+rowData.charge_total+'",';
        text += '"'+rowData.order_date+'",';
        text += '"'+rowData.status+'"';

        // Download file.
        const element = document.createElement("a");
        element.href = 'data:text/plain;charset=utf-8,'+encodeURIComponent(text);
        element.download = 'Order'+rowData.order_id+'.csv';
        document.body.appendChild(element);
        element.click();
    }

    // Generate output and display webpage.
    return (
        <main>
            <Navbar/>
            <div className="App" style={{position:"relative", top:"100px"}}>
                <Grid container spacing={1}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                <div>
                    {iserror && 
                        <Alert severity="error">
                            {errorMessages.map((msg, i) => {
                                return <div key={i}>{msg}</div>
                            })}
                        </Alert>
                    }       
                </div>
                    <MaterialTable
                    title="Orders"
                    columns={columns}
                    data={data}
                    icons={tableIcons}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve);
                        }),
                        onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            handleRowDelete(oldData, resolve)
                        }),
                    }}
                    actions={[
                        {
                          icon: ArrowDownwardIcon,
                          tooltip: 'Download Data as CSV',
                          onClick: (e, rowData) => {
                            handleClick(rowData)
                          }
                        }
                      ]}
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
                <Grid item xs={3}></Grid>
                </Grid>
            </div>
        </main>
    );
}

export default Shipping
