import * as React from 'react';
import './SimpleCalendar.css'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { Order, TableMonth } from '../../../objects/objects';

import { getOrders } from '../../../API/api'
import { formatDate, daysInMonth } from '../../../helpers/helperMethods'

const monthsCzech = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"]


interface SimpleCalendarProps {
    activeRow: any
    setActiveRow: any
}

const SimpleCalendar = ((props: SimpleCalendarProps) => {
    const { activeRow, setActiveRow } = props

    const [tableMonths, setTableMonths] = React.useState<Array<TableMonth>>();
    // const [activeRow, setActiveRow] = React.useState<Order>(props.setActiveRow);

    const fillTables = ((dbOrders: Order[]): any => {
        var tableMonthsArr = new Array<TableMonth>();
        if (dbOrders) {
            for (var month = 1; month <= 12; month++) {
                var daysForMonth = new Array<Order>()
                var diM = daysInMonth(month, 2022);

                for (var day = 1; day <= diM; day++) {
                    var newDate = new Date(`$${month}.${day}.2022 12:00:00`);
                    var maybeNewOrder = {
                        date: newDate, city: "", name: "", email: "", phone: "", project: false, description: ""
                    } as Order

                    for (var dbOrder of dbOrders as Order[]) {
                        if (newDate.toLocaleDateString() == dbOrder.date.toLocaleDateString()) {
                            maybeNewOrder.date = dbOrder.date
                            maybeNewOrder.city = dbOrder.city
                            maybeNewOrder.name = dbOrder.name
                            maybeNewOrder.email = dbOrder.email
                            maybeNewOrder.phone = dbOrder.phone
                            maybeNewOrder.project = dbOrder.project
                            maybeNewOrder.description = dbOrder.description
                        }
                    }
                    daysForMonth.push(maybeNewOrder)
                }

                tableMonthsArr.push({
                    number: month,
                    name: monthsCzech[month - 1],
                    days: daysForMonth
                })
            }
        }
        setTableMonths(tableMonthsArr);
    })

    React.useEffect(() => {
        (async () => {
            var dbOrders = await getOrders() as Order[]
            fillTables(dbOrders);
        })()
    }, [activeRow])

    React.useEffect(() => {
        (async () => {
            var dbOrders = await getOrders() as Order[]
            fillTables(dbOrders);
        })()
    }, [])

    const handleClick = ((x: Order) => {
        setActiveRow(x)
        console.log("clicked: ", x)
    })

    return (
        <>
            {tableMonths && tableMonths.map((month, idm) => {
                return (
                    <div className="tableWrapper">
                        {month.name}
                        <TableContainer component={Paper} key={idm}>
                            <Table size="small" className="table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="71px">Datum</TableCell>
                                        <TableCell width="1000px">Město</TableCell>
                                        <TableCell width="1000px">Název</TableCell>
                                        <TableCell width="10px">Projekt</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {month.days.map((row, idd) => {
                                        return (
                                            <TableRow
                                                key={idd + 12}
                                                className={row.email != "" ? "fullTableRow" : "tableRow"}
                                                onClick={row.email != "" ? () => { } : () => handleClick(row)}
                                            >
                                                {/*style={{borderBottom:"none"}}*/}
                                                <TableCell>{formatDate(row.date)}</TableCell>
                                                <TableCell>{row.city}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell align="center">{row.project ? row.project == true ? <CheckIcon className="icon" /> : <CloseIcon className="icon" /> : <></>}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )
            })}
        </>
    )
})

export default SimpleCalendar