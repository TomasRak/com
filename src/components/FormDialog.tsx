import * as React from 'react';
import { postOrder } from '../API/api'
import { Order } from '../objects/objects'

import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface FormDialogProps {
    activeRow: Order
    setActiveRow: any
}


export const FormDialog = ((props: FormDialogProps) => {
    const { setActiveRow, activeRow } = props

    const validateEditOrder = ((editOrder: Order): boolean => {
        var errorObj = {} as any
        errorObj.name = editOrder.name == ""
        errorObj.city = editOrder.city == ""
        errorObj.email = editOrder.email == ""

        var isValid = !(errorObj.date || errorObj.city || errorObj.email);
        if (!isValid) setEditOrderErrors(errorObj)
        return isValid;
    })

    var [editOrderErrors, setEditOrderErrors] = React.useState({
        date: false,
        city: false,
        name: false,
        email: false,
        phone: false,
        project: false,
        description: false
    });

    var [editOrder, setEditOrder] = React.useState<Order>(activeRow)

    React.useEffect(() => {
        console.log(activeRow)
    }, [])

    const handleCancel = () => {
        setActiveRow(null);
    };

    const handleConfirm = () => {
        if (validateEditOrder(editOrder)) {
            if (!editOrder.project) editOrder.project = false  
            console.log("postSucessfull?: ", postOrder(editOrder))
            setActiveRow(null);
        }
    };

    var autoComplete = false;
    return (
        <div>
            <Dialog open={activeRow != null} onClose={handleCancel}>
                <DialogTitle>Přidat událost</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Rezervace pro den {editOrder.date.toLocaleDateString("cs-CZ")}
                    </DialogContentText>
                    <div className="formGroup">
                        <TextField
                            autoComplete= {autoComplete ? 'on' : 'off'}
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
                        />
                        <TextField
                            autoComplete= {autoComplete ? 'on' : 'off'}
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
                            autoComplete= {autoComplete ? 'on' : 'off'}
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
                            autoComplete= {autoComplete ? 'on' : 'off'}
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
                            autoComplete= {autoComplete ? 'on' : 'off'}
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
                        <div className="project">
                            <Checkbox
                                value={editOrder.project}
                                onChange={((e) => {
                                    setEditOrder({ ...editOrder, project: e.target.checked })
                                })}
                                id="Projekt"
                            />
                            <Typography className="projectDesc">Jedná se o přednášku v rámci "Projektových dnů"?</Typography>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Storno</Button>
                    <Button onClick={handleConfirm}>Potvrdit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})