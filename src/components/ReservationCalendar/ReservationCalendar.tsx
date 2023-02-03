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

import { Order, TableMonth, ClassCount } from '../../objects/objects';
import { Checkbox, SxProps, TextField } from '@mui/material';
import { Select, MenuItem, InputLabel, ListItemText } from '@mui/material';
import { Button, CircularProgress, LinearProgress, Paper, Snackbar, Typography, Chip, IconButton } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';
import { makeStyles, createStyles } from '@material-ui/core/styles';

/* BUGS
When todays date is sent, the calendar date stays on todays date, even though it is not selectable


*/

var classOptions = ["MŠ", "1. třída ZŠ", "2. třída ZŠ", "3. třída ZŠ", "4. třída ZŠ", "5. třída ZŠ", "6. třída ZŠ", "7. třída ZŠ", "8. třída ZŠ", "9. třída ZŠ", "SŠ"]

var editOrderEmpty = {
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    city: "",
    name: "",
    email: "",
    phone: "",
    project: false,
    description: "",
    classCounts: []
} as Order

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles(() =>
    createStyles({
        picker: {
            '& .MuiPickersBasePicker-pickerView': {
                justifyContent: "start !important",
                height: "420px"
            }
        },
        pickerMobile: {
            '& .MuiPickersBasePicker-pickerView': {
                justifyContent: "start !important",
                height: "320px"
            }
        },
    })
);

const ReservationCalendar = (() => {
    const classes = useStyles();

    var [editOrder, setEditOrder] = React.useState<Order>(editOrderEmpty)
    var [snackbarData, setSnackbarData] = React.useState({ open: false, type: "error", message: "" })

    var [allOrders, setAllOrders] = React.useState<Order[]>()

    var [isMobile, setIsMobile] = React.useState(window.innerWidth < 1200);
    React.useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 1200);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                    editOrderEmpty.classCounts = [];
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
        <div style={{ display: "inline-block", marginBottom: "30px" }}>
            <h1 style={{ margin: isMobile ? "15px" : "60px" }}>Rezervační {isMobile ? <br></br> : <></>} kalendář</h1>
            {allOrders ? <div className="App appWrapper">
                <Paper style={{ width: isMobile ? "330px" : "", padding: "10px", height: `${(isMobile ? 1054 : 535) + Object.values(editOrderErrors).filter((x: boolean) => x).length * 23}px`/*495px ideally */ }} elevation={1}>
                    <div style={{ display: "inline-block", float: "left", marginRight: "20px", marginBottom: "10px", userSelect: "none" }}>
                        <Paper style={{
                            padding: "10px"
                            , height: isMobile ? undefined : `${515 + Object.values(editOrderErrors).filter((x: boolean) => x).length * 23}px`/*467px ideally */,
                            fontSize: isMobile ? undefined : `${45}px`
                        }} elevation={5}>
                            <MuiPickersUtilsProvider locale={cs} utils={DateFnsUtils}>
                                <div className={isMobile ? classes.pickerMobile : classes.picker}>
                                    <DatePicker
                                        variant={"static"}
                                        size="medium"
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
                                </div>
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
                            style={{ marginTop: isMobile ? 10 : 0 }}
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
                            label="Třídy a počty dětí"
                            id="tridy"
                            InputLabelProps={{ shrink: editOrder.classCounts.length > 0 ? true : false }}
                            value={editOrder.classCounts}
                            SelectProps={{
                                renderValue: (selected: any) => {
                                    return selected.map((x: any) => `${x.class} = ${isNaN(x.count) ? 0 : x.count} dětí`).join(', ')
                                },
                                autoWidth: true
                            }}
                            select
                            fullWidth
                            margin="dense"
                        >
                            <Button
                                fullWidth
                                disableRipple
                                variant="contained"
                                style={{ width: "264px", marginLeft: "16px", marginRight: "16px", marginBottom: "10px" }}
                                onClick={() => {
                                    var newOrder = { ...editOrder };

                                    var firstUnusedClass = classOptions.find((x) => !newOrder.classCounts.some((f) => x == f.class))
                                    if (firstUnusedClass == undefined) return;

                                    newOrder.classCounts.push({ count: 25, class: firstUnusedClass } as ClassCount)
                                    setEditOrder(newOrder)
                                }}
                            >
                                <AddIcon />
                                Přidat třídu
                            </Button>
                            {editOrder.classCounts.map((classCount) => (
                                <MenuItem
                                    style={{ marginTop: "8px", backgroundColor: "transparent", cursor: "default" }}
                                    disableRipple

                                    selected={false}
                                    onKeyDown={(e) => { e.stopPropagation() }}
                                >
                                    <TextField
                                        select
                                        label="Třída"
                                        style={{ width: "125px", marginRight: "15px" }}
                                        value={classCount.class}
                                        onChange={(e) => {
                                            var value = e.target.value;
                                            var newOrder = { ...editOrder };

                                            newOrder.classCounts.map((x) => {
                                                if (x.class == classCount.class)
                                                    x.class = value
                                                else
                                                    return x;
                                            })
                                            setEditOrder(newOrder)

                                        }}
                                    >
                                        {classOptions.map((f) => {
                                            if (f !== classCount.class && editOrder.classCounts.some((x) => x.class == f)) return
                                            return (<MenuItem value={f}>{f}</MenuItem>)
                                        })}
                                    </TextField>
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        label="Počet"
                                        type="number"
                                        style={{ width: "75px" }}
                                        value={classCount.count}
                                        onChange={(e) => {
                                            if (e.target.value == "-1" || e.target.value.length > 2) return
                                            e.target.value = e.target.value.replace(/^0+|-/, "")
                                            var value = parseInt(e.target.value);

                                            var newOrder = { ...editOrder };
                                            newOrder.classCounts.map((x) => {
                                                if (x.class == classCount.class)
                                                    x.count = value
                                            })
                                            setEditOrder(newOrder)
                                        }} />
                                    <IconButton
                                        // style={{ scale: "1.6" }}
                                        onClick={() => {
                                            var newOrder = { ...editOrder };
                                            newOrder.classCounts = newOrder.classCounts.filter((x) => x.class !== classCount.class)
                                            setEditOrder(newOrder)
                                        }}>
                                        {/* <ClearIcon />  */}
                                        <DeleteIcon />
                                    </IconButton>
                                    <div style={{ backgroundColor: "#c5c5c5", width: "94%", height: "1px", position: "absolute", top: "-10%", left: "3%" }}></div>
                                </MenuItem>
                            ))}
                        </TextField>
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
                            rows={5}
                        />
                        <div style={{ float: "left", marginTop: "2px", display: "inline-flex" }}>
                            <Checkbox
                                checked={editOrder.project}
                                onChange={((e) => {
                                    setEditOrder({ ...editOrder, project: e.target.checked })
                                })}
                                id="Projekt"
                            />
                            <Typography style={{ display: "inline", marginTop: "9px" }}>Jedná se o přednášku v rámci "Projektových dnů"?</Typography>
                        </div>
                        <div style={{ float: "right", marginTop: "4px", width: isMobile ? "100%" : "" }}>
                            <Button
                                style={{ width: isMobile ? "100%" : "" }}
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