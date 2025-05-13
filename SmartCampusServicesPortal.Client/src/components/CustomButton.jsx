import React from 'react'
import { Button } from '@mui/material'

export const CustomButton = ((props) => {
    const { handle, size = "large", label, variant, loading, color} = props;
    return (
        <Button
            loadingIndicator="Loading…"
            size={size}
            loading={loading}
            color={color}
            onClick={handle}
            variant={variant}
            >
            {label}
        </Button>
    )
})

export default CustomButton