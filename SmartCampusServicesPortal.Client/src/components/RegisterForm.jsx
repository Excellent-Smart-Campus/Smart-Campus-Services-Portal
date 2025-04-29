import React from 'react';
import { Col, Form, ButtonToolbar, Row, SelectPicker, CheckPicker, FlexboxGrid} from 'rsuite';
import { TextField } from '@/components/TextField';
import { CustomButton } from '@/components/CustomButton';
import { mapCoursesToOptions, mapSubjectsToOptions} from "@/utils/mapper.jsx";

export const RegisterForm = ((props) => {
    const { formRef, setFormValue, formValue, model, step, titleOptions,
        courseOptions, setSelectedCourse, subjectOptions } = props;

    const isSubjectDisabled = !formValue.course;
    const getLabelFromOptions = (value, options) => {
        const option = options.find(option => option.value === value);
        return option ? option.label : value; // If not found, return the value itself
    }
    
    return (
        <>
            <Form fluid ref={formRef} onChange={setFormValue} formValue={formValue} model={model}>
                <Row className="show-grid" gutter={24} >
                    {step === 1 && (
                        <>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} className="text">
                                    <Form.Group controlId="course">
                                        <Form.ControlLabel>Title</Form.ControlLabel>
                                        <Form.Control
                                            name="title"
                                            accepter={SelectPicker}
                                            data={titleOptions || []}
                                            placeholder="Select Title"
                                            searchable
                                            style={{ width: 240 }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Col xs={24} sm={24} md={12} lg={12} className="text">
                                <TextField name="firstname" label="First Name" />
                            </Col>
        
                            <Col xs={24} sm={24} md={12} lg={12} className="text">
                                <TextField name="lastname" label="Last Name" />
                            </Col>
                            
                            <Col xs={24} sm={24} md={24} lg={24} className="text">
                                <TextField name="email" label="Email" />
                            </Col>
        
                            <Col xs={24} sm={24} md={24} lg={24} className="text">
                                <TextField name="phone" label="Phone Number" />
                            </Col>
        
                            <Col xs={24} sm={24} md={12} lg={12} className="text">
                                <TextField name="password" label="Password" type="password" autoComplete="off" />
                            </Col>
        
                            <Col xs={24} sm={24} md={12} lg={12} >
                                <TextField name="confirmPassword" label="Verify password" type="password" autoComplete="off" />
                            </Col>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Col xs={24} sm={24} md={24} lg={24} className="text">
                                <Form.Group controlId="course">
                                    <Form.ControlLabel>Course</Form.ControlLabel>
                                    <Form.Control
                                        name="course"
                                        accepter={SelectPicker}
                                        data={mapCoursesToOptions(courseOptions) || []}
                                        placeholder="Select Course"
                                        searchable
                                        style={{ width: '100%' }}
                                        onChange={value => setSelectedCourse(value)}
                                    />
                                </Form.Group>
                            </Col>
        
                            <Col xs={24} sm={24} md={24} lg={24} className="text">
                                <Form.Group controlId="subjects">
                                    <Form.ControlLabel>Subjects</Form.ControlLabel>
                                    <Form.Control
                                        name="subjects"
                                        accepter={CheckPicker}
                                        data={mapSubjectsToOptions(subjectOptions) || []}
                                        multiple
                                        placeholder="Select Subject"
                                        searchable
                                        style={{ width: '100%' }}
                                        disabled={isSubjectDisabled}
                                    />
                                </Form.Group>
                            </Col>
                        </>
                    )}

                    {step === 3 && (
                        <Col xs={24} sm={24} md={24} lg={24} className="text">
                            <h5>Please review your details:</h5>
                            <br/>

                            <p><strong>Title:</strong> {getLabelFromOptions(formValue.title, titleOptions)}</p>
                            <p><strong>First Name:</strong> {formValue.firstname}</p>
                            <p><strong>Last Name:</strong> {formValue.lastname}</p>
                            <p><strong>Email:</strong> {formValue.email}</p>
                            <p><strong>Phone:</strong> {formValue.phone}</p>
                            <br/>
                            <FlexboxGrid>
                                {/* Heading */}
                                <FlexboxGrid.Item colspan={24} className="course-info-left">
                                    <h5>Course Info:</h5>
                                </FlexboxGrid.Item>
                                
                                <FlexboxGrid.Item colspan={8} style={{ marginTop: '1rem' }}>
                                    <strong>Course Code:</strong>
                                </FlexboxGrid.Item>

                                <FlexboxGrid.Item colspan={16} style={{ marginTop: '1rem' }}>
                                    <strong>Course Name:</strong>
                                </FlexboxGrid.Item>

                                {courseOptions.filter(
                                    course => formValue.course === course.courseId)
                                    .map((course, index) => (
                                        <FlexboxGrid.Item key={index} colspan={24}>
                                            <FlexboxGrid style={{ marginTop: '0.5rem' }}>
                                                <FlexboxGrid.Item colspan={8}>
                                                    {course.courseCode}
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item colspan={16}>
                                                    {course.courseName}
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </FlexboxGrid.Item>
                                    ))}
                                
                                <FlexboxGrid.Item colspan={8} style={{ marginTop: '1rem' }}>
                                    <strong>Subject Code:</strong> 
                                </FlexboxGrid.Item>
                                
                                <FlexboxGrid.Item colspan={16} style={{ marginTop: '1rem' }}>
                                    <strong>Subject Name:</strong> 
                                </FlexboxGrid.Item>
                                
                                {subjectOptions.filter(
                                    subject => formValue.subjects?.includes(subject.subjectId))
                                        .map((subject, index) => (
                                    <FlexboxGrid.Item key={index} colspan={24}>
                                        <FlexboxGrid style={{ marginTop: '0.5rem' }}>
                                            <FlexboxGrid.Item colspan={8}>
                                                {subject.subjectCode}
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item colspan={16}>
                                                {subject.subjectName}
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </FlexboxGrid.Item>
                                ))}
                            </FlexboxGrid>
                        </Col>
                    )}
                </Row>
            </Form>
        </>
    )
})