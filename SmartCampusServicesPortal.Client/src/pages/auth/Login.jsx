import  {useState, useEffect, useRef } from 'react';
import { Container, Col, Content, Form, ButtonToolbar, Panel, FlexboxGrid } from 'rsuite';
import { TextField } from '@/components/TextField';
import { model } from '@/helper/ValidateLogin';
import { CustomButton } from '@/components/CustomButton.jsx';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext.jsx';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import './authstyles.scss';

function Login() {
    const { login, loading, setLoading } = useAuth();
    const formRef = useRef();
    const [formValue, setFormValue] = useState({email: '', password: ''});
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(false);
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
                <FlexboxGrid justify="center" align="middle" className={"min-height"} >
                    <FlexboxGrid.Item as={Col} colspan={22} md={12} lg={10} xl={8}>
                        <Panel header="Login">
                            <Form fluid ref={formRef} onChange={setFormValue} formValue={formValue} model={model}>
                                <TextField name="email" label="Email" type="email" />
                                <TextField name="password" label="Password" showeye={false} type="password" />
                                
                                <ButtonToolbar style={{marginBottom: "1em"}}>
                                    <CustomButton
                                        handle={handleSubmit} 
                                        label={'Sign in'}
                                        loading={loading}
                                        variant={'contained'}
                                        color={'primary'}
                                    />
                                </ButtonToolbar>

                                <p >Don't have an account
                                    <CustomButton
                                        handle={()=>navigate(constantRoutes.auth.signUp)}
                                        label={'register!'}
                                        color={'secondary'}
                                    />
                                </p>
                            </Form>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Content>
        </Container>
    )
}
export default Login