import React from 'react'
import { Button } from 'rsuite'

export const CustomButton = ((props) => {
    const { handle, label, appearance, mybtn } = props;
    return (
        
        <Button 
            className={`${mybtn} responsive-button`} 
            onClick={handle} 
            appearance={appearance}
            block
        >
            {label}
        </Button>
    )
})

export default CustomButton