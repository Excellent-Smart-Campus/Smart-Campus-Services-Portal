import React from 'react';

import { Form, DatePicker } from 'rsuite';

export const CustomDatePicker = React.forwardRef((props, ref) => {
    const { name, label, oneTap = true, pickerType = 'date', placeholder = 'Select Date',
        style = { width: '100%' }, ...rest } = props;

    const getFormat = () => {
        switch (pickerType) {
            case 'month':
                return 'yyyy-MM';
            case 'year':
                return 'yyyy';
            default:
                return 'yyyy-MM-dd';
        }
    };

    const getAppearance = () => {
        switch (pickerType) {
            case 'month':
                return 'subtle';
            case 'year':
                return 'subtle';
            default:
                return 'default';
        }
    };
    
    return (
        <Form.Group controlId={`${name}`} ref={ref}>
            <Form.ControlLabel>{label}</Form.ControlLabel>
            <Form.Control
                name={name}
                accepter={DatePicker}
                format={getFormat()}
                placeholder={placeholder}
                appearance={getAppearance()}
                oneTap={oneTap}
                style={style}
                
                {...(pickerType === 'month' && { format: 'yyyy-MM', placement: 'bottomStart', showMonthDropdown: true })}
                {...(pickerType === 'year' && { format: 'yyyy-MM', placement: 'bottomStart', showMonthDropdown: true, showMeridian: false })}
                {...rest} />
        </Form.Group>
    );
});