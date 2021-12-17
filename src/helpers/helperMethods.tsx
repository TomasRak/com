import * as React from 'react'

const formatDate = (d: Date) => {
    return `${d.getDate().toString()
        .padStart(2, '0')}.${(d.getMonth() + 1).toString()
            .padStart(2, '0')}.${d.getFullYear()}`;
};

const daysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
}

export {formatDate, daysInMonth}