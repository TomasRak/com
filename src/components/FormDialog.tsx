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
    
    var [editOrder, setEditOrder] = React.useState<Order>(activeRow)

    React.useEffect(() => {
        console.log(activeRow)
    }, [])

    const handleCancel = () => {
        setActiveRow(null);
    };

    const handleConfirm = () => {
        console.log("project: ", editOrder.project)
        console.log("postSucessfull?: ", postOrder(editOrder))
        setActiveRow(null);
    };
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
                            value={editOrder.city}
                            onChange={((e) => {
                                setEditOrder({ ...editOrder, city: e.target.value })
                            })}
                            margin="dense"
                            id="mesto"
                            label="Město"
                            fullWidth
                            variant="outlined"
                            required={true}
                        />
                        <TextField
                            value={editOrder.name}
                            onChange={((e) => {
                                setEditOrder({ ...editOrder, name: e.target.value })
                            })}
                            autoFocus
                            margin="dense"
                            id="nazev"
                            label="Název"
                            fullWidth
                            variant="outlined"
                            required={true}
                        />
                        <TextField
                            value={editOrder.email}
                            onChange={((e) => {
                                setEditOrder({ ...editOrder, email: e.target.value })
                            })}
                            autoFocus
                            margin="dense"
                            id="mail"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            required={true}
                        />
                        <TextField
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
                                    setEditOrder({ ...editOrder, project: e.target.value == '1'})
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