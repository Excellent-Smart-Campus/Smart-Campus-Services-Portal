import React from 'react';
import { Form, TimePicker } from 'rsuite';

export const CustomTimePicker = React.forwardRef((props, ref) => {
        const { name, label, placeholder = 'Select Time',
            isStart = false, startTime = null, ...rest } = props;
        
        const getMaxTime = (hour) => (isStart 
            ? hour < 8 || hour > 18 
            : hour < 9 || hour > 19 
        );

        const shouldDisableHour =(hour) => {
            if (isStart) {
                return hour < 8 || hour > 18;
            } else {
                if (!startTime) return true; 
                const minEndHour = new Date(startTime).getHours() + 1;
                return hour < minEndHour || hour > 19;
            }
        };

        const hideMinute = (minute) => {
            if (isStart) {
                return minute % 15 !== 0;
            }else{
                if (!startTime) return true; 
                return minute % 15 !== 0;
            }
        };

        return (
            <Form.Group controlId={`${name}-1`} ref={ref}>
                <Form.ControlLabel>{label}</Form.ControlLabel>
                <Form.Control
                    name={name}
                    accepter={TimePicker}
                    format={'HH:mm'}
                    shouldDisableHour={shouldDisableHour}
                    shouldDisableMinute={hideMinute}
                    hideHours={hour => getMaxTime(hour)}
                    hideMinutes={minute => minute % 15 !== 0} editable={false}
                    placeholder={placeholder}
                    appearance="default"
                    oneTap={false}
                    hideSeconds
                    style={{ width: '100%' }}
                    ref={ref}
                    placement="bottomStart"
                    ranges={[]}
                    container={() => document.querySelector('.dialog-modal')}
                    {...rest}
                />
            </Form.Group>
        );
});