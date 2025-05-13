import React from 'react';
import { Col, Form, Row, SelectPicker} from 'rsuite';
import { TextField } from '@/components/TextField';
import { CustomDatePickerLimit } from "@/components/CustomDatePickerLimit.jsx";
import { CustomTimePicker } from "@/components/CustomTimePicker.jsx";
import { mapRoomsToOptions } from "@/utils/mapper.jsx";

export const BookRoomForm = ((props) => {
    const { formRef, setFormValue, formValue, model, roomOptions } = props;
    
    return (
        <Form fluid ref={formRef} onChange={setFormValue} formValue={formValue} model={model}>
            <Row className="show-grid" gutter={24} >
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12} style={{marginBlock: '1rem'}} className="text">
                        <Form.Group controlId="room">
                            <Form.ControlLabel>Select a Room for Booking</Form.ControlLabel>
                            <Form.Control
                                name="room"
                                accepter={SelectPicker}
                                data={mapRoomsToOptions(roomOptions) || []}
                                placeholder="Select Room for Booking"
                                searchable
                                style={{ width: '100%' }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Col xs={24} sm={24} md={24} lg={24} style={{marginBlock: '1rem'}} className="text">
                    <TextField name="purpose" label="Purpose of the booking" />
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} style={{marginBlock: '1rem'}} className="text">
                    <CustomDatePickerLimit name="bookingDate" label="Booking Date" pickerType="date" />
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} style={{marginBlock: '1rem'}} className="text">
                    <CustomTimePicker
                        name="startTime"
                        label="Start Time"
                        placeholder="Select start time"
                        isStart
                    />
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} style={{marginBlock: '1rem'}} className="text">
                    <CustomTimePicker
                        name="endTime"
                        label="End Time"
                        placeholder="Select end time"
                        startTime={formValue.startTime}
                    />
                </Col>
            </Row>
        </Form>
    )
})