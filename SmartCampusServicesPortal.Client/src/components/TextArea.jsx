import React from "react";
import { Form, Input } from "rsuite";

const CustomTextarea = React.forwardRef((props, ref) => (
    <Input
        {...props}
        as="textarea"
        ref={ref}
        style={{
            resize: "vertical",
            minHeight: "100px",
            maxHeight: "300px",
            ...props.style, 
        }}
    />
));

export const TextArea = React.forwardRef((props, ref) => {
    const { name, label, rows = 6, ...rest } = props;
    
    return (
        <Form.Group controlId={`${name}-4`} ref={ref}>
            <Form.ControlLabel>{label}</Form.ControlLabel>
            <Form.Control 
                name={name} 
                accepter={CustomTextarea}
                rows={rows}
                {...rest} />
        </Form.Group>
    );
});