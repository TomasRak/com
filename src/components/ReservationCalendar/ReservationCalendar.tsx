import * as React from 'react';
import './ReservationCalendar.css'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from "@date-io/date-fns";
import { cs } from "date-fns/locale";

import { getOrders, postOrder } from '../../API/api'

import { FormDialog } from './FormDialog';
import SimpleCalendar from './components/SimpleCalendar';

import { Order, TableMonth } from '../../objects/objects';
import { Checkbox, TextField } from '@mui/material';
import { Button, CircularProgress, LinearProgress, Paper, Snackbar, Typography } from '@material-ui/core';
import MuiAlert from '@mui/material/Alert';

/* BUGS
When todays date is sent, the calendar date stays on todays date, even though it is not selectable


*/

var editOrderEmpty = {
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    city: "",
    name: "",
    email: "",
    phone: "",
    project: false,
    description: "",
} as Order

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ReservationCalendar = (() => {

    var [editOrder, setEditOrder] = React.useState<Order>(editOrderEmpty)
    var [snackbarData, setSnackbarData] = React.useState({ open: false, type: "error", message: "" })

    var [allOrders, setAllOrders] = React.useState<Order[]>()

    React.useEffect(() => {
        getOrders().then((resp: any) => {
            setAllOrders(resp)
        })
    }, [])

    const handleCloseSnackbar = (event: any, reason: any) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarData({ open: false, type: snackbarData.type, message: snackbarData.message });
    };

    const validateEditOrder = ((editOrder: Order): boolean => {
        var errorObj = {} as any
        errorObj.name = editOrder.name == ""
        errorObj.city = editOrder.city == ""
        errorObj.email = editOrder.email == ""

        var isValid = !(errorObj.date || errorObj.city || errorObj.email);
        if (!isValid) setEditOrderErrors(errorObj)
        return isValid;
    })

    const handleConfirm = async () => {
        if (validateEditOrder(editOrder)) {
            if (!editOrder.project) editOrder.project = false
            await postOrder(editOrder).then(async (resp: any) => {
                console.log("response", resp)
                if (resp === false) {
                    setSnackbarData({ open: true, type: "error", message: "Nastala chyba, zkuste opakovat akci." });
                    return
                }
                console.log("editOrderEmpty", editOrderEmpty)
                await getOrders().then((resp: any) => {
                    console.log("new orders came", resp)
                    setAllOrders(resp)
                    setEditOrder(editOrderEmpty);
                })
                setSnackbarData({ open: true, type: "success", message: "Informace úspěšně odeslány na server!" });
            })
        }
        else
            setSnackbarData({ open: true, type: "warning", message: "Některé údaje nebyly správně vyplněny!" });
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
            <h1>Rezervační kalendář</h1>
            {allOrders ? <div className="App appWrapper">
                <Paper style={{ padding: "10px", height: `${495 + Object.values(editOrderErrors).filter((x: boolean) => x).length * 23}px`/*495px ideally */ }} elevation={1}>
                    <div style={{ display: "inline-block", float: "left", marginRight: "20px", marginBottom: "10px", userSelect: "none" }}>
                        <Paper style={{
                            padding: "10px"
                            , height: `${475 + Object.values(editOrderErrors).filter((x: boolean) => x).length * 23}px`/*475px ideally */
                        }} elevation={5}>
                            <MuiPickersUtilsProvider locale={cs} utils={DateFnsUtils}>
                                <DatePicker
                                    variant={"static"}
                                    minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                    value={editOrder.date}
                                    onChange={(x: any) => {
                                        setEditOrder({ ...editOrder, date: x })
                                    }}
                                    shouldDisableDate={(x: any) => {
                                        if (x.getMonth() === 11) return true;

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
                            // autoFocus
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
                            // autoFocus
                            margin="dense"
                            id="nazev"
                            label="Název školy"
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
                            // autoFocus
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
                            // autoFocus
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
                            // autoFocus
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
                                checked={editOrder.project}
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
                                Odeslat
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div> : <CircularProgress />}

            <Snackbar open={snackbarData.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarData.type} sx={{ width: '100%' }}>
                    {snackbarData.message}
                </Alert>
            </Snackbar>
        </div>
    );
})

export default ReservationCalendar;