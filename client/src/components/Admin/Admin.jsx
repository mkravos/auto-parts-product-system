// Require dependencies
import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';

// Require material-UI libraries
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

// Require navbar to be shown on page
import Navbar from '../Navbar/Navbar';

// Define table icons
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

const Admin = () => {
    // Define columns.
    const columns2 = [ // order
        {title: "Order ID", field: "order_id", width: "1/4"},
        {title: "Customer ID", field: "customer_id"},
        {title: "Weight", field: "weight"},
        {title: "Shipping", field: "shipping"},
        {title: "Handling", field: "handling"},
        {title: "Total Charge", field: "charge_total"},
        {title: "Order Date", field: "order_date"},
        {title: "Status", field: "status"},
    ]
    const columns = [ // extra_charge
        {title: "Weight", field: "weight"},
        {title: "Shipping", field: "shipping"},
        {title: "Handling", field: "handling"},
    ]

    // For table data.
    const [data2, setData2] = useState([]); // order
    const [data, setData] = useState([]); // extra_charge

    // For error handling.
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        // Fetch all order data from database and add to table.
        api.get('/customer_interaction/order/all')
            .then(res => {
                setData(res.data)
            })
            .catch(error=>{
                console.log("Error")
            })
    }, [])
    useEffect(() => {
        // Fetch all extra charge data from database and add to table.
        api.get('/customer_interaction/extra_charge/all')
            .then(res => {
                setData(res.data)
            })
            .catch(error=>{
                console.log("Error")
            })
    }, [])

    // Validates input and handles row updating (editing) on the extra_charge table.
    // Parameters: newData, oldData, resolve.
    // Returns: Nothing
    const handleRowUpdate = (newData, oldData, resolve) => {
        // Validate input.
        let errorList = []
        if(newData.weight === ""){
            errorList.push("Please enter weight.")
        }
        if(newData.shipping === ""){
            errorList.push("Please enter shipping cost.")
        }
        if(newData.handling === ""){
            errorList.push("Please enter handling cost.")
        }

        if(errorList.length < 1){
            api.put('/customer_interaction/extra_charge/update', newData)
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

    // Validates input and handles adding new rows to the extra_charge table.
    // Parameters: newData, resolve.
    // Returns: Nothing
    const handleRowAdd = (newData, resolve) => {
        // Validate input.
        let errorList = []
        if(newData.weight === ""){
            errorList.push("Please enter weight.")
        }
        if(newData.shipping === ""){
            errorList.push("Please enter shipping cost.")
        }
        if(newData.handling === ""){
            errorList.push("Please enter handling cost.")
        }

        if(errorList.length < 1){
            api.post("/customer_interaction/extra_charge/create", newData)
                .then(res => {
                    let dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    resolve()
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Cannot add data. Server error!"])
                    resolve()
                })
        }
        else{
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }
    }

    // Validates input and handles removing rows from the extra_charge table.
    // Parameters: oldData, resolve.
    // Returns: Nothing
    const handleRowDelete = (oldData, resolve) => {
        api.delete("/customer_interaction/extra_charge/delete/"+oldData.weight)
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

    return (
        <main>
            <Navbar/>
            <div className="App" style={{position:"relative", top:"100px"}}>
            <center><h1>Admin Panel</h1></center>
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
                    columns={columns2}
                    data={data2}
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
                <Grid item xs={3}></Grid>
                </Grid>

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
                    title="Extra Charge"
                    columns={columns}
                    data={data}
                    icons={tableIcons}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve)
                        }),
                        onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            handleRowAdd(newData, resolve)
                        }),
                        onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            handleRowDelete(oldData, resolve)
                        }),
                    }}
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

export default Admin
