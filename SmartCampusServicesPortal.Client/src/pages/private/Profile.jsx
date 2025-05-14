import React, { useState,  useEffect} from 'react';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { Box, Grid } from '@mui/material';
import { useAuth } from "@/context/AuthContext.jsx";
import { contactType } from "@/utils/constants.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import EditableGroup from '@/components/EditableGroup.jsx';
import ApiClient from '@/service/ApiClient';
import {Error, Success} from "@/helper/Toasters.jsx";
import {getErrorMessageFromResponse} from "@/utils/getErrorMessageFromResponse.jsx";

function Profile() {
    const {setLoading, profile } = useAuth();
    const [titles, setTitles] = useState([]);

    useEffect(() => {
        setLoading(false);
        const fetchData = async () => {
            const userTitles = await ApiClient.instance.getUserTitles();
            setTitles(userTitles);
        }
        fetchData();
    }, []);
    
    const safeContacts = Array.isArray(profile?.contacts) ? profile.contacts : [];

    const getContactDetail = (type) =>
        safeContacts.find(c => c.contactType === type) || {};

    const handleContactSave = async (data, oldData) => {
        setLoading(true);
      let userData = {
            C: bookForm.room,
            purpose: bookForm.purpose,
            bookingDate: bookForm.bookingDate,
            startTime: formatTimeOnly(bookForm.startTime),
            endTime: formatTimeOnly(bookForm.endTime)
        }

        try {
            const response = await ApiClient.instance.setUserContant(userData);
            Success(response.message);
            navigate(constantRoutes.auth.login);
        } catch(e) {
            Error(getErrorMessageFromResponse(e));
        }finally {
            setLoading(false);
        }
    }
    
    return (
        <Box>
            <CustomBreadcrumb
                items={[
                    { label: 'Home', link: constantRoutes.protected.index },
                    { label: 'Profile', link: constantRoutes.protected.profile},
                ]}
            />
            
            <Grid container spacing={3}>
                <Grid item order={{ xs: 1}} size={{ xs: 12, md: 8 }}>

                        <CustomContainer
                            bg={'white'}
                            title={'Profile'}
                            children={
                                <EditableGroup
                                    fields={[
                                        {
                                            key: 'firstName',
                                            label: 'First Name',
                                            value: profile.firstName || '',
                                            editable: false,
                                        },
                                        {
                                            key: 'lastName',
                                            label: 'Last Name',
                                            value: profile.lastName || '',
                                            editable: false,
                                        },
                                        {
                                            key: 'title',
                                            label: 'Title',
                                            value: profile.title || '',
                                            editable: false,
                                            type: 'select',
                                            options: titles.map((t) => ({ label: t.name, value: t.id }))
                                        },
                                    ]}
                                    onSave={(updated) => {
                                        console.log('Updated values:', updated);
                                    }}
                                />
                            }
                        />
                </Grid>
                
                <Grid item order={{ xs: 2 }} size={{ xs: 12, md: 4 }}>
                    <CustomContainer
                        bg={'white'}
                        title={'Contacts'}
                        children={
                            <EditableGroup
                                fields={[
                                    {
                                        key: 'email',
                                        label: 'Email',
                                        value: getContactDetail(contactType.Email)?.detail,
                                        detail: getContactDetail(contactType.Email),
                                        editable: true,
                                    },
                                    {
                                        key: 'phone',
                                        label: 'Phone Number',
                                        value: getContactDetail(contactType.CellPhone)?.detail,
                                        detail: getContactDetail(contactType.CellPhone),
                                        editable: true,
                                    },
                                ]}
                                    onSave={(updated, oldData) => handleContactSave(updated, oldData)}
                                />
                            }
                        />
                </Grid>
            </Grid>
        </Box>
    );
}

export default Profile