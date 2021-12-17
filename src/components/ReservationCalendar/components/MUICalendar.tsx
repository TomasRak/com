import * as React from 'react';
import './MUICalendar.css'

import { Calendar, momentLocalizer  } from 'react-big-calendar' 
// import Globalize from 'globalize-webpack-plugin'
const Globalize = require('globalize-webpack-plugin');

// =================> uninstall material-ui/pickers??!?
// import { useStaticState, Calendar } from '@material-ui/pickers';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// import DateAdapter from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DateTimePicker from '@mui/lab/DateTimePicker';

import { formatDate, daysInMonth } from '../../../helpers/helperMethods'

const localizer = momentLocalizer(Globalize)

const MUICalendar = (() => {
    var currentDate = new Date("2/28/2020")
    console.log(currentDate.getDate())
    console.log(currentDate.getMonth())
    console.log(currentDate.getFullYear())


    return (
        <>
            <div>
                <Calendar
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </>
    )
})

export default MUICalendar