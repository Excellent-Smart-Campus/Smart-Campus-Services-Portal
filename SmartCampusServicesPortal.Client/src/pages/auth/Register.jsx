import  {useState, useEffect, useRef } from 'react';
import { Container, Col, Content, Panel, ButtonToolbar, FlexboxGrid, Steps } from 'rsuite';
import { RegisterForm } from '@/components/RegisterForm.jsx';
import { CustomButton } from "@/components/CustomButton.jsx";
import { useNavigate } from "react-router-dom";
import { model } from '@/helper/ValidateRegister';
import { Success, Error } from '@/helper/Toasters.jsx';
import { constantRoutes } from "@/utils/constantRoutes";
import ApiClient from '@/service/ApiClient';
import {errorMessages} from "@/utils/errorMessages";
import { mapTitlesToOptions } from "@/utils/mapper.jsx";

function Register() {
    const formRef = useRef();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [titles, setTitles] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({title: 0, firstname: '', lastname: '',
        email: '', phone: '', password: '', confirmPassword: '', subjects: [], course: 0
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const courses = await ApiClient.instance.getCourseById(null);
                const userTitles = await ApiClient.instance.getUserTitles();
                setCourses(courses);
                setTitles(userTitles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            const fetchSubjects = async () => {
                const response = await ApiClient.instance.getSubjectsCourseById(selectedCourse);
                setSubjects(response);
            }
            fetchSubjects();
        } else {
            setSubjects([]);
        }
    }, [selectedCourse]);
    
    const handleNext = e => {
        e.preventDefault();
        let fieldsToValidate = [];
        if (step === 1) {
            fieldsToValidate = ['title', 'firstname', 'lastname', 'email', 'phone', 'password', 'confirmPassword'];
        } else if (step === 2) {
            fieldsToValidate = ['subjects', 'course'];
        }

        // Manually validate only these fields
        const form = formRef.current;
        const checkResults = fieldsToValidate.map(field => form.checkForField(field));

        if (checkResults.includes(false)) {
            // If any field validation failed, don't proceed
            return;
        }       
        setStep(prev => prev + 1);
    };
    const handleBack = async e => {
        e.preventDefault();
        setStep(prev => prev - 1);
    };
    const handleSubmit = async e => {
        e.preventDefault();
        if (!formRef.current.check()) {
            return;
        }

        let userData = {
            title: formValue.title,
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            email: formValue.email,
            phone: formValue.phone,
            password: formValue.password,
            confirmPassword: formValue.confirmPassword,
            subjects: formValue.subjects,
            course: formValue.course
        }

        try {
            const response = await ApiClient.instance.register(userData);

            if (!response.success) {
                if (response.errors) {
                    const allErrors = Object.values(response.errors).flat().join(' -- ');
                    setErrors({ general: allErrors });
                    return;
                } else {
                    setErrors({ general: response.message });
                    return;
                }
            }

            setErrors({});
        } catch(e) {
            console.log(e);
            setErrors({ general: errorMessages.error });
        }
    };

    return (
        <Container className='login'>
            <Content className='siginForm'>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item as={Col} colspan={22} md={15} lg={12} xl={10}>
                        <Panel header="Student Register" bordered>
                            {/* Stepper */}
                            <Steps current={step} style={{marginBottom: 20}}>
                                <Steps.Item title="Personal Info"/>
                                <Steps.Item title="Subjects & Course"/>
                                <Steps.Item title="Confirm"/>
                            </Steps>

                            <RegisterForm
                                formRef={formRef}
                                setFormValue={setFormValue}
                                formValue={formValue}
                                model={model}
                                step={step}
                                titleOptions={mapTitlesToOptions(titles)}
                                courseOptions={courses}
                                setSelectedCourse={setSelectedCourse}
                                subjectOptions={subjects}
                       
                            />

                            {errors.general && (
                                <div className='dropdown-errors'>
                                    <h4 className='error'>{errors.general}</h4>
                                </div>
                            )}

                            <ButtonToolbar  className="button-toolbar">
                                {step > 1 && (
                                    <CustomButton mybtn={'mybtn'} handle={handleBack} label={'Back'} appearance={"primary"} />
                                )}
                                {step < 3 && (
                                    <CustomButton mybtn={'mybtn'} handle={handleNext} label={'Next'} appearance="primary"/>
                                )}
                                {step === 3 && (
                                    <CustomButton mybtn={'mybtn'} handle={handleSubmit} label={'Submit'} appearance="primary" />
                                )}
                            </ButtonToolbar>
                            <p>Already have an account click
                                <CustomButton mybtn={'links'} appearance={"link"}
                                    handle={()=> navigate(constantRoutes.auth.login)} label={'here!'}/>
                            </p>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Content>
        </Container>
    )
}

export default Register