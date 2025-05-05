import React from 'react'
import { Button } from '@mui/material'

export const CustomButton = ((props) => {
    const { handle, label, variant, loading, color} = props;
    return (
        <Button
            loadingIndicator="Loading…"
            size="large"
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