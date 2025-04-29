import  {useState, useEffect, useRef } from 'react';
import { Container, Col, Content, Form, Button, ButtonToolbar, Panel, FlexboxGrid } from 'rsuite';
import { TextField } from '@/components/TextField';
import { model } from '@/helper/ValidateLogin';
import { CustomButton } from '@/components/CustomButton.jsx';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext.jsx';
import './authstyles.scss';
import {constantRoutes} from "@/utils/constantRoutes.jsx";

function Login() {
    const { login, errors, loading, setLoading, setErrors } = useAuth();
    const formRef = useRef();
    const [formValue, setFormValue] = useState({email: '', password: ''});
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
        setErrors('');
    }, []);
    
    const handleSubmit = async e => {
        e.preventDefault();
        if (!formRef.current.check()) {
            return;
        }
        await login(formValue.email, formValue.password);
    };
    
    return (
        <Container className='login'>
            <Content className='siginForm'>
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item as={Col} colspan={22} md={12} lg={10} xl={8}>
                        <Panel header="Login">
                            <Form fluid ref={formRef} onChange={setFormValue} formValue={formValue} model={model}>
                                <TextField name="email" label="Email"/>
                                <TextField name="password" label="Password" type="password" autoComplete="off" />
                                
                                <ButtonToolbar style={{marginBottom: "1em"}}>
                                    <CustomButton mybtn={'mybtn'} handle={handleSubmit} label={'Sign in'} appearance={"primary"} />
                                </ButtonToolbar>

                                <p >Don't have an account<CustomButton mybtn={'links'} appearance={"link"} handle={()=>navigate(constantRoutes.auth.signUp)} label={'register!'} /></p>
                                {errors.general && <p className="error">{errors.general}</p>}
                            </Form>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Content>
        </Container>
    )
}
export default Login