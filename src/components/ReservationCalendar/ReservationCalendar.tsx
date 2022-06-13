import * as React from 'react';
import './ReservationCalendar.css'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from "@date-io/date-fns";
import { cs } from "date-fns/locale";

import { getOrders } from '../../API/api'

import { FormDialog } from './FormDialog';
import SimpleCalendar from './components/SimpleCalendar';

import { Order, TableMonth } from '../../objects/objects';
import { Checkbox, TextField } from '@mui/material';
import { Button, Paper, Typography } from '@material-ui/core';

var heh = {
    date: new Date(),
    city: "",
    name: "",
    email: "",
    phone: "",
    project: false,
    description: "",
} as Order

const ReservationCalendar = (() => {
    var [editOrder, setEditOrder] = React.useState<Order>(heh)
    var [dateSelected, setDateSelected] = React.useState(false)

    var [allOrders, setAllOrders] = React.useState<Order[]>()

    React.useEffect(() => {
        getOrders().then((resp: any) => {
            // console.log(resp)
            // await setTimeout(() => {}, 1000)
            setAllOrders(resp)
        })
    }, [])

    const validateEditOrder = ((editOrder: Order): boolean => {
        var errorObj = {} as any
        errorObj.name = editOrder.name == ""
        errorObj.city = editOrder.city == ""
        errorObj.email = editOrder.email == ""

        var isValid = !(errorObj.date || errorObj.city || errorObj.email);
        if (!isValid) setEditOrderErrors(errorObj)
        return isValid;
    })


    const handleConfirm = () => {
        // if (validateEditOrder(editOrder)) {
        //     if (!editOrder.project) editOrder.project = false  
        //     console.log("postSucessfull?: ", postOrder(editOrder))
        //     setActiveRow(null);
        // }
    };

    var [editOrderErrors, setEditOrderErrors] = React.useState({
        date: false,
        city: false,
        name: false,
        email: false,
        phone: false,
        project: false,
        description: false
    });

    const autoComplete = false;
    return (
        <div style={{ display: "inline-block", margin: "30px" }}>
            {allOrders && <div className="App appWrapper">
                <Paper style={{ padding: "10px", height: "495px" }} elevation={1}>
                    <div style={{ display: "inline-block", float: "left", marginRight: "20px", marginBottom: "10px" }}>

                        <Paper style={{ padding: "10px", height: "475px" }} elevation={5}>
                            <MuiPickersUtilsProvider locale={cs} utils={DateFnsUtils}>
                                <DatePicker
                                    variant={"static"}
                                    minDate={new Date()}
                                    // labelFunc={(x: any) => x.toLocaleString("cs", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                        // `${x.getDate()}${x.getMonth()}`
                                    // }
                                    value={editOrder.date}
                                    onChange={(x: any) => {
                                        setEditOrder({ ...editOrder, date: x })
                                        setDateSelected(true)
                                    }}
                                    shouldDisableDate={(x: any) => {
                                        // var now = new Date()
                                        // if (now.getFullYear() === x.getFullYear() && now.getMonth() === x.getMonth() && now.getDate() === x.getDate()){
                                        //     console.log("dateFayl", x)
                                        //     return true
                                        // }

                                        if (allOrders !== undefined)
                                            return (allOrders?.filter((f: any) => f.date.getFullYear() === x.getFullYear() && f.date.getMonth() === x.getMonth() && f.date.getDate() === x.getDate()).length > 0)
                                        else throw ("Impossible happended")
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Paper>
                    </div>

                    <div className="inputDiv">
                        <TextField
                            autoComplete={autoComplete ? 'on' : 'off'}
                            value={editOrder.city}
                            onChange={((e) => {
                                if (editOrderErrors.city) setEditOrderErrors({ ...editOrderErrors, city: false })
                                setEditOrder({ ...editOrder, city: e.target.value })
                            })}
                            error={editOrderErrors.city}
                            helperText={editOrderErrors.city ? "Město musí být vyplněno!" : ""}
                            margin="dense"
                            id="mesto"
                            label="Město"
                            fullWidth
                            variant="outlined"
                            required={true}
                            style={{ marginTop: 0 }}
                        />
                        <TextField
                            autoComplete={autoComplete ? 'on' : 'off'}
                            value={editOrder.name}
                            onChange={((e) => {
                                if (editOrderErrors.name) setEditOrderErrors({ ...editOrderErrors, name: false })
                                setEditOrder({ ...editOrder, name: e.target.value })
                            })}
                            error={editOrderErrors.name}
                            helperText={editOrderErrors.name ? "Název musí být vyplněn!" : ""}
                            autoFocus
                            margin="dense"
                            id="nazev"
                            label="Název"
                            fullWidth
                            variant="outlined"
                            required={true}
                        />
                        <TextField
                            autoComplete={autoComplete ? 'on' : 'off'}
                            value={editOrder.email}
                            onChange={((e) => {
                                if (editOrderErrors.email) setEditOrderErrors({ ...editOrderErrors, email: false })
                                setEditOrder({ ...editOrder, email: e.target.value })
                            })}
                            error={editOrderErrors.email}
                            helperText={editOrderErrors.email ? "Email musí být vyplněn!" : ""}
                            autoFocus
                            margin="dense"
                            id="mail"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            required={true}
                        />
                        <TextField
                            autoComplete={autoComplete ? 'on' : 'off'}
                            value={editOrder.phone}
                            onChange={((e) => {
                                setEditOrder({ ...editOrder, phone: e.target.value })
                            })}
                            autoFocus
                            margin="dense"
                            id="telefon"
                            label="Telefon"
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            autoComplete={autoComplete ? 'on' : 'off'}
                            value={editOrder.description}
                            onChange={((e) => {
                                setEditOrder({ ...editOrder, description: e.target.value })
                            })}
                            autoFocus
                            margin="dense"
                            id="popis"
                            label="Popis"
                            fullWidth
                            variant="outlined"
                            multiline={true}
                            rows={6}
                        />
                        <div style={{ float: "left", marginTop: "8px" }}>
                            <Checkbox
                                value={editOrder.project}
                                onChange={((e) => {
                                    setEditOrder({ ...editOrder, project: e.target.checked })
                                })}
                                id="Projekt"
                            />
                            <Typography style={{ display: "inline" }}>Jedná se o přednášku v rámci "Projektových dnů"?</Typography>
                        </div>
                        <div style={{ float: "right", marginTop: "8px" }}>
                            <Button
                                variant={"contained"}
                                onClick={handleConfirm}>
                                Potvrdit
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>}
        </div>
    );
})

export default ReservationCalendar;