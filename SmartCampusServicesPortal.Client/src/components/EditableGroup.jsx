import { useState } from 'react';
import { Box, Typography,Select, TextField, Grid } from '@mui/material';
import { ButtonToolbar } from 'rsuite';
import { CustomButton } from "@/components/CustomButton.jsx";

const EditableGroup = ({ fields, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [oldContacts, setOldContacts] = useState(() =>
        fields.reduce((acc, field) => {
            return field.detail || {};
        }, {})
    );
    
    const [values, setValues] = useState(() =>
        fields.reduce((acc, field) => {
        acc[field.key] = field.value || '';
        return acc;
        }, {})
    );

    const handleChange = (key, newValue, oldData) => {
        setOldContacts(prev => ({ ...prev, [key]: oldData }));
        setValues(prev => ({ ...prev, [key]: newValue }));
    };

    const handleToggleEdit = () => {
        setIsEditing(prev => !prev);
    };
    
    const handleSave = () => {
         const updatedContacts = Object.keys(values).map((key) => {
            const oldData = oldContacts[key] || {};
            return {
                contactId: oldData.contactId || null,
                contactType: oldData.contactType, // Must be retained to match
                detail: values[key]
            };
        });
        console.log(updatedContacts);
        onSave(values, oldContacts);
        setIsEditing(false);
    };

    return (
        <Box>
            <Grid container spacing={4}  sx={{ my: 4 }}>
                {fields.map((field) => (
                    <Grid size={{ xs: 12, md: 12}}  key={field.key}>
                        <Typography  sx={{ opacity: '0.5', mb:'1em' }} color="text.secondary">
                            {field.label}
                        </Typography>
                        
                        {isEditing && field.editable ? 
                            (
                                field.type === 'select' ? 
                                (
                                    <Select
                                        fullWidth
                                        variant="standard"
                                        value={values[field.key]}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                    >
                                        {field.options?.map((option) => (
                                            console.log(option)
                                        ))}
                                    </Select>
                                ):(
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        color='secondary'
                                        value={values[field.key]}
                                        onChange={(e) => handleChange(field.key, e.target.value, field?.detail)}
                                    />
                                )
                            ) : (
                                <>
                                    <Typography >{values[field.key] || '—'}</Typography>
                                </>
                            )
                        }
                    </Grid>
                ))}
            </Grid>

            <ButtonToolbar  className="button-toolbar">
                {isEditing ?
                    <>
                        <CustomButton
                            handle={handleToggleEdit}
                            label={'Cancel'}
                            variant={'contained'}
                            color={'primary'}
                        />


                        <CustomButton
                            handle={handleSave}
                            label={'Save'}
                            variant={'contained'}
                            color={'secondary'}
                        />
                    </>
                  
                :
                    <CustomButton
                        handle={handleToggleEdit}
                        label={'Edit'}
                        variant={'contained'}
                        color={'secondary'}
                    />
                }
            </ButtonToolbar>
        </Box>
    );
};

export default EditableGroup;
