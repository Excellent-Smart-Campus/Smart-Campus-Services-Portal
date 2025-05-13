import React from 'react';

import { Form, DatePicker } from 'rsuite';

export const CustomDatePickerLimit = React.forwardRef((props, ref) => {
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
        <Form.Group controlId={`${name}-6`} ref={ref}>
            <Form.ControlLabel>{label}</Form.ControlLabel>
            <Form.Control
                name={name}
                accepter={DatePicker}
                format={getFormat()}
                placeholder={placeholder}
                appearance={getAppearance()}
                oneTap={oneTap}
                style={style}
                disabledDate={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const max = new Date(today);
                    max.setMonth(max.getMonth() + 1);
                    return date < today || date > max;
                }}
                {...rest} />
        </Form.Group>
    );
});