import  {useState, useEffect, useRef } from 'react';
import { Container, Col, Content, Panel, ButtonToolbar, FlexboxGrid, Steps } from 'rsuite';
import { RegisterForm } from '@/forms/RegisterForm.jsx';
import { CustomButton } from "@/components/CustomButton.jsx";
import { useNavigate } from "react-router-dom";
import { model } from '@/helper/ValidateRegister';
import { constantRoutes } from "@/utils/constantRoutes";
import { getErrorMessageFromResponse } from '@/utils/getErrorMessageFromResponse.jsx';
import { Error, Success } from '@/helper/Toasters.jsx'; 
import { mapTitlesToOptions } from "@/utils/mapper.jsx";
import { useAuth } from '@/context/AuthContext.jsx';
import ApiClient from '@/service/ApiClient';

function Register() {
    const formRef = useRef();
    const { setLoading } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [titles, setTitles] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({title: null, firstname: '', lastname: '',
        email: '', phone: '', password: '', confirmPassword: '', subjects: [], course: null
    });

    useEffect(() => {
        setLoading(false);
        const fetchData = async () => {
            const courses = await ApiClient.instance.getCourseById(null);
            const userTitles = await ApiClient.instance.getUserTitles();
            setCourses(courses);
            setTitles(userTitles);
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

        const form = formRef.current;
        const checkResults = fieldsToValidate.map(field => form.checkForField(field));

        if (checkResults.includes(false)) {
            return;
        }       
        setStep(prev => prev + 1);
    };
    const handleBack = async e => {
        e.preventDefault();
        setStep(prev => prev - 1);
    };

    const handleSubmit = async e => {
        setLoading(true);
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
            Success(response.message);
            navigate(constantRoutes.auth.login);
        } catch(e) {
            Error(getErrorMessageFromResponse(e));
        }finally {
            setLoading(false);
        }
    };

    return (
        <Container className='login'>
            <Content className='siginForm'>
                <FlexboxGrid justify="center" align="middle" className={"min-height"}>
                    <FlexboxGrid.Item as={Col} colspan={22} md={15} lg={12} xl={10}>
                        <Panel header="Student Register" bordered>
         
                            <Steps small current={step} style={{marginBottom: 20}}>
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

                            <ButtonToolbar  className="button-toolbar">
                                {step > 1 && (
                                    <CustomButton
                                        handle={handleBack}
                                        label={'Back'}
                                        variant={'contained'}
                                        color={'primary'}
                                    />
                                )}
                                {step < 3 && (
                                    <CustomButton
                                        handle={handleNext}
                                        label={'Next'}
                                        variant={'contained'}
                                        color={'primary'}
                                    />
                                )}
                                {step === 3 && (
                                    <CustomButton
                                        handle={handleSubmit}
                                        label={'Submit'}
                                        variant={'contained'}
                                        color={'primary'}
                                    />
                                )}
                            </ButtonToolbar>
                            <p>Already have an account click
                                <CustomButton color={'secondary'}
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