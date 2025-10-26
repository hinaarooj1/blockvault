import React, { useState } from 'react';
import moment from 'moment';
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

const DateRangeCalendar = () => {
    const [state, setState] = useState({
        start: moment().subtract(29, 'days'),
        end: moment(),
    });
    const { start, end } = state;
    const handleCallback = (start, end) => {
        setState({ start, end });
    };
    const label =   start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
    return (
        <DateRangePicker             
            initialSettings={{
            startDate: start.toDate(),
            endDate: end.toDate(),
            ranges: {
                Today: [moment().toDate(), moment().toDate()],
                Yesterday: [
                moment().subtract(1, 'days').toDate(),
                moment().subtract(1, 'days').toDate(),
                ],
                'Last 7 Days': [
                moment().subtract(6, 'days').toDate(),
                moment().toDate(),
                ],
                'Last 30 Days': [
                moment().subtract(29, 'days').toDate(),
                moment().toDate(),
                ],
                'This Month': [
                moment().startOf('month').toDate(),
                moment().endOf('month').toDate(),
                ],
                'Last Month': [
                moment().subtract(1, 'month').startOf('month').toDate(),
                moment().subtract(1, 'month').endOf('month').toDate(),
                ],
            },
            }}
            onCallback={handleCallback}
        >
            <div id="reportrange" className="pull-right reportrange"
                style={{
                    width: '100%',
                }}
            >                                    
                <span>{label}</span> <i className="fas fa-chevron-down ms-sm-3 ms-0"></i>
            </div>
        </DateRangePicker>
    );
};

export default DateRangeCalendar;