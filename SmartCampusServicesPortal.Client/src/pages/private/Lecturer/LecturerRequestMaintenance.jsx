import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { userActions } from "@/utils/authEnums";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { MaintenanceForm } from "@/forms/MaintenanceForm.jsx";
import { modelMaintenance } from '@/helper/ValidateMaintenance.jsx';
import { ButtonToolbar } from 'rsuite';
import { useService } from "@/context/ServiceContext.jsx";
import { getErrorMessageFromResponse } from "@/utils/getErrorMessageFromResponse.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { Box } from '@mui/material';
import { Error, Success } from '@/helper/Toasters.jsx';
import { filterStudyRooms } from  '@/utils/mapper.jsx';
import AccessGuard from "@/components/AccessGuard.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomButton from "@/components/CustomButton.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import ApiClient from '@/service/ApiClient';


function LecturerRequestMaintenance(){
    const { setLoading } = useAuth();
    const { rooms } = useService();
    const navigate = useNavigate();
    const maintenanceFormRef = useRef();
    const [ maintenanceForm, setMaintenanceForm ] = useState({name: '', room: null, description: ''});

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleMaintenanceRequest = async e => {
        setLoading(true);
        e.preventDefault();
        if (!maintenanceFormRef.current.check()) {
            setLoading(false);
            return;
        }

        try {
            const response = await ApiClient.instance.requestMaintenance(
                maintenanceForm.name, maintenanceForm.room, maintenanceForm.description
            );
            Success(response.message);
            navigate(constantRoutes.protected.index);
        } catch(e) {
            Error(getErrorMessageFromResponse(e));
        }finally {
            setLoading(false);
        }
    }
    
    return (
        <AccessGuard accessKey={userActions.REPORT_MAINTENANCE_ISSUE}>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Lecturer', link: constantRoutes.protected.index },
                            { label: 'Maintenance', link: constantRoutes.protected.lecturer.maintenanceRequest},
                        ]}
                    />
                }
                title={'Request Maintenance'}
                children={
                    <Box>
                        <MaintenanceForm
                            formRef={maintenanceFormRef}
                            setFormValue={setMaintenanceForm}
                            formValue={maintenanceForm}
                            model={modelMaintenance}
                            roomsOptions={filterStudyRooms(rooms)}
                        />

                        <ButtonToolbar  className="button-toolbar" style={{marginTop: "4em"}}>
                            <CustomButton
                                handle={()=> navigate(constantRoutes.protected.index)}
                                label={'cancel'}
                                variant={'contained'}
                                color={'primary'}
                            />
                            <CustomButton
                                handle={handleMaintenanceRequest}
                                label={'submit'}
                                variant={'contained'}
                                color={'secondary'}
                            />
                        </ButtonToolbar>
                    </Box>
                }
            />
        </AccessGuard>
    );
}

export default LecturerRequestMaintenance;