import React from 'react';
import { Col, Form, Row, SelectPicker } from 'rsuite';
import { TextField } from '@/components/TextField';
import { TextArea } from "@/components/TextArea.jsx";
import { mapRoomsToOptions } from "@/utils/mapper.jsx";

export const MaintenanceForm = ((props) => {
    const { formRef, setFormValue, formValue, model, roomsOptions } = props;

    return (
        <Form fluid ref={formRef} onChange={setFormValue} formValue={formValue} model={model}>
            <Row className="show-grid" gutter={24} >
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12} style={{marginBlock: '1rem'}} className="text">
                        <Form.Group controlId="room">
                            <Form.ControlLabel>Select a Room for Maintenance</Form.ControlLabel>
                            <Form.Control
                                name="room"
                                accepter={SelectPicker}
                                data={mapRoomsToOptions(roomsOptions) || []}
                                placeholder="Select Room for Maintenance"
                                searchable
                                style={{ width: '100%' }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Col xs={24} sm={24} md={24} lg={24} style={{marginBlock: '1rem'}} className="text">
                    <TextField name="name" label="Subject Issue" />
                </Col>
                
                <Col xs={24} sm={24} md={24} lg={24} style={{marginBlock: '1rem'}} className="text">
                    <TextArea name="description" label="Description" />
                </Col>
            </Row>
        </Form>
    )
})