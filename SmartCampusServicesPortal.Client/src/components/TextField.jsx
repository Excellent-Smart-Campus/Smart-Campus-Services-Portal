import React from "react";
import { Input, InputGroup, Form, Progress } from 'rsuite';
import EyeCloseIcon from '@rsuite/icons/EyeClose';
import VisibleIcon from '@rsuite/icons/Visible';

export const TextField = React.forwardRef((props, ref) => {
    const { name, label, accepter, type,showProgress = false, showBoth = false, showEye=false, ...rest } = props;
    const [visible, setVisible] = React.useState(false);
    const [passwordValue, setPasswordValue] = React.useState("");

    const isPassword = type === "password";
    const inputType = isPassword && visible ? "text" : type;

    const calculateStrength = (password) => {
        let strength = 0;
        if (password.length > 5) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getStrengthLabel = (score) => {
        if (score <= 2) return { label: "Weak", color: "red" };
        if (score === 3) return { label: "Fair", color: "orange" };
        if (score === 4) return { label: "Medium", color: "yellow" };
        return { label: "Strong", color: "green" };
    };

    const strengthScore = calculateStrength(passwordValue);
    const strength = getStrengthLabel(strengthScore);
    
    return (
        <Form.Group controlId={`${name}-4`} ref={ref}>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            {isPassword ? (
                <>
                   
                    {showEye || !showBoth && (
                        <InputGroup inside>
                            <Form.Control
                                name={name}
                                accepter={Input}
                                type={inputType}
                                autoComplete="off"
                                value={passwordValue}
                                onChange={setPasswordValue}
                                {...rest}
                            />
                            <InputGroup.Button onClick={() => setVisible(!visible)}>
                                {visible ? <VisibleIcon /> : <EyeCloseIcon />}
                            </InputGroup.Button>
                        </InputGroup>
                    )}

                    {showProgress && !showBoth && passwordValue && (
                        <div style={{ marginTop: 8 }}>
                            <Progress.Line
                                percent={(strengthScore / 5) * 100}
                                strokeColor={strength.color}
                                showInfo={false}
                                style={{ height: 6 }}
                            />
                            <div style={{ fontSize: 12, color: strength.color, marginTop: 4 }}>
                                Strength: {strength.label}
                            </div>
                        </div>
                    )}

                    {showBoth && (
                        <>
                            <InputGroup inside>
                                <Form.Control
                                    name={name}
                                    accepter={Input}
                                    type={inputType}
                                    autoComplete="off"
                                    value={passwordValue}
                                    onChange={setPasswordValue}
                                    {...rest}
                                />
                                <InputGroup.Button onClick={() => setVisible(!visible)}>
                                    {visible ? <VisibleIcon /> : <EyeCloseIcon />}
                                </InputGroup.Button>
                            </InputGroup>
                            {passwordValue && (
                                <div style={{ marginTop: 8 }}>
                                    <Progress.Line
                                        percent={(strengthScore / 5) * 100}
                                        strokeColor={strength.color}
                                        showInfo={false}
                                        style={{ height: 6 }}
                                    />
                                    <div style={{ fontSize: 12, color: strength.color, marginTop: 4 }}>
                                        Strength: {strength.label}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <Form.Control name={name} accepter={accepter} type={type} {...rest} />
            )}

        </Form.Group>
    );
});