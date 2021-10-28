import * as React from 'react';
import { getOrders } from '../../API/api'

import { FormDialog } from './FormDialog';
import SimpleCalendar from './components/SimpleCalendar';

import { Order, TableMonth } from '../../objects/objects';

const ReservationCalendar = (() => {
    const [activeRow, setActiveRow] = React.useState<Order>();

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
            <SimpleCalendar
                activeRow={activeRow}
                setActiveRow={setActiveRow}
            />
        </div>
    );
})

export default ReservationCalendar;