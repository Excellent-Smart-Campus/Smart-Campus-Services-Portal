import React from 'react';
import { Col, Form, Row, SelectPicker} from 'rsuite';
import { TextField } from '@/components/TextField';
import {CustomDatePickerLimit} from "@/components/CustomDatePickerLimit.jsx";
import {mapSubjectsToOptions, mapLecturersToOptions} from "@/utils/mapper.jsx";
import {CustomTimePicker} from "@/components/CustomTimePicker.jsx";

export const AppointmentForm = ((props) => {
    const { formRef, setFormValue, formValue, model, subjectOptions, lecturerOptions } = props;
    
    return (
        <Form fluid ref={formRef} onChange={setFormValue} formValue={formValue} model={model}>
            <Row className="show-grid" gutter={24} >
                
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12} style={{marginBlock: '1rem'}} className="text">
                        <Form.Group controlId="subject">
                            <Form.ControlLabel>Choose a subject</Form.ControlLabel>
                            <Form.Control
                                name="subject"
                                accepter={SelectPicker}
                                data={mapSubjectsToOptions(subjectOptions) || []}
                                placeholder="Select subject"
                                searchable
                                style={{ width: '100%' }}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} style={{marginBlock: '1rem'}} className="text">
                        <Form.Group controlId="room">
                            <Form.ControlLabel>Choose a lecturer</Form.ControlLabel>
                            <Form.Control
                                name="lecturer"
                                accepter={SelectPicker}
                                data={mapLecturersToOptions(lecturerOptions) || []}
                                placeholder="Select lecturer"
                                searchable
                                style={{ width: '100%' }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Col xs={24} sm={24} md={24} lg={24} style={{marginBlock: '1rem'}} className="text">
                    <TextField name="purpose" label="Purpose of the appointment" />
                </Col>
                
                <Col xs={24} sm={24} md={24} lg={12} style={{marginBlock: '1rem'}} className="text">
                    <CustomDatePickerLimit name="appointmentDate" label="Appointment Date" pickerType="date" />
                </Col>
                
                <Col xs={24} sm={24} md={12} lg={12} style={{marginBlock: '1rem'}} className="text">
                    <CustomTimePicker
                        name="startTime"
                        label="Appointment Time"
                        placeholder="Select appointment time"
                        isStart
                    />
                </Col>
            </Row>
        </Form>
    )
})