import * as React from 'react';
import { getOrders } from '../../API/api'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import { Order, TableMonth } from '../../objects/objects'
import { FormDialog } from '../FormDialog';

const monthsCzech = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"]

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

const ReservationCalendar = (() => {
  const [activeRow, setActiveRow] = React.useState<Order>();
  const [dbOrders, setDbOrders] = React.useState<Order[]>();
  const [tableMonths, setTableMonths] = React.useState<Array<TableMonth>>();

  React.useEffect(() => {
    console.log("THIS IT ???!??!XDDD: ", dbOrders)
    var array = new Array<TableMonth>();
    if (dbOrders) {
      console.log("IM IN")
      for (var i = 1; i <= 12; i++) {
        var daysForMonth = new Array<Order>()
        var diM = daysInMonth(i, 2021);

        for (var y = 1; y <= diM; y++) {
          var newDate = new Date(`${i}.${y}.2021 12:00:00`);
          var maybeNewOrder = {
            date: newDate,
            city: "",
            name: "",
            email: "",
            phone: "",
            project: false,
            description: ""
          } as Order

          for (var dbOrder of dbOrders as Order[]) {
            if (newDate.toLocaleDateString() == dbOrder.date.toLocaleDateString()) {
                console.log("in if")
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

        array.push({
          number: i,
          name: monthsCzech[i - 1],
          days: daysForMonth
        })
      }
    }
    setTableMonths(array);
  }, [dbOrders])

  React.useEffect(() => {
    (async () => {
      var apiRespData = await getOrders() as Order[]
      for (var order of apiRespData) {
        order.date = new Date(order.date)
      }
      console.log("this returned: ", apiRespData)
      setDbOrders(apiRespData);
    })()
  }, [activeRow])

  React.useEffect(() => {
    (async () => {
      var apiRespData = await getOrders() as Order[]
      for (var order of apiRespData) {
        order.date = new Date(order.date)
      }
      console.log("this returned: ", apiRespData)
      setDbOrders(apiRespData);
    })()
  }, [])

  const handleClick = ((x: Order) => {
    setActiveRow(x)
    console.log("clicked: ", x)
  })

  return (
    <div className="App appWrapper">
      {activeRow ?
        <FormDialog
          setActiveRow={setActiveRow}
          activeRow={activeRow as Order}
        />
        :
        <></>}
      <h1>Rezervační kalendář</h1>
      {tableMonths && tableMonths.map((month, idm) => {
        return (
          <div className="tableWrapper">
            {month.name}
            <TableContainer component={Paper} key={idm}>
              <Table size="small" className="table">
                <TableHead>
                  <TableRow>
                    <TableCell>Datum</TableCell>
                    <TableCell align="right">Město</TableCell>
                    <TableCell align="right">Název</TableCell>
                    <TableCell align="right">Projekt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {month.days.map((row, idd) => {

                    return (
                      <TableRow
                        key={idd + 12}
                        className={row.email != "" ? "fullTableRow" : "tableRow"}
                        onClick={row.email != "" ? () => {} : () => handleClick(row)}
                      >
                        {/*style={{borderBottom:"none"}}*/}
                        <TableCell align="left" >{row.date.toLocaleDateString("cs-CZ")}</TableCell>
                        <TableCell align="right">{row.city}</TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.project == true ? "Ano" : "Ne"}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )
      })}
    </div>
  );
})

export default ReservationCalendar;