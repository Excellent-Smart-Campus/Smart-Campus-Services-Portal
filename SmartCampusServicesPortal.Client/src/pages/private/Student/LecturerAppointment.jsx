import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { modelAppointment } from '@/helper/ValidateLectureAppointment.jsx';
import { ButtonToolbar } from 'rsuite';
import { AppointmentForm } from "@/forms/AppointmentForm.jsx";
import { useEducation } from "@/context/EducationContext.jsx";
import {formatTimeOnly} from "@/utils/formatTimeOnly.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomButton from "@/components/CustomButton.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import ApiClient from '@/service/ApiClient';
import {Error, Success} from "@/helper/Toasters.jsx";
import {getErrorMessageFromResponse} from "@/utils/getErrorMessageFromResponse.jsx";
import {useAuth} from "@/context/AuthContext.jsx";

function LecturerAppointment(){
    const { setLoading } = useAuth();
    const { enrolled } = useEducation()
    const [ getLecturerSubjects, setLecturerSubjects ] = useState([]);
    const [ appointmentForm, setAppointmentForm ] = useState({
        subject: null, lecturer: null, purpose: '', appointmentDate: null,  startTime: null, endTime: null});
    const navigate = useNavigate();
    const appointmentFormRef = useRef();

    useEffect(() => {
        setLoading(false);
        const fetchSubjectDetails = async () => {
            if (appointmentForm.subject) {
                const response = await ApiClient.instance.getSubjectLecturers(appointmentForm.subject);
                setLecturerSubjects(response);
            }
        };
        fetchSubjectDetails();
    }, [appointmentForm.subject]);
    
    const handleAppointment = async e => {
        setLoading(true);
        e.preventDefault();
        if (!appointmentFormRef.current.check()) {
            setLoading(false);
            return;
        }

        let userData = {
            subject: appointmentForm.subject,
            lecturer: appointmentForm.lecturer,
            purpose: appointmentForm.purpose,
            appointmentDate: appointmentForm.appointmentDate,
            startTime: formatTimeOnly(appointmentForm.startTime),
            endTime: formatTimeOnly(appointmentForm.endTime)
        }
        try {
            const response = await ApiClient.instance.scheduleAppointment(userData);
            Success(response.message);
            navigate(constantRoutes.protected.index);
        } catch (e) {
            Error(getErrorMessageFromResponse(e));
        } finally{
            setLoading(false);
        }
    }

    return (
        <CustomContainer
            breadcrum={
                <CustomBreadcrumb
                    items={[
                        { label: 'Student', link: constantRoutes.protected.index },
                        { label: 'Schedule', link: constantRoutes.protected.student.lecturerAppointment},
                    ]}
                />
            }
            title={'Schedule Lecturer Appointment'}
            children={
                <>
                    <AppointmentForm
                        formRef={appointmentFormRef}
                        setFormValue={setAppointmentForm}
                        formValue={appointmentForm}
                        model={modelAppointment}
                        subjectOptions={enrolled}
                        lecturerOptions={getLecturerSubjects}
                    />

                    <ButtonToolbar  className="button-toolbar" style={{marginTop: "2em"}}>
                        <CustomButton
                            handle={()=> navigate(constantRoutes.protected.index)}
                            label={'cancel'}
                            variant={'contained'}
                            color={'primary'}
                        />
                        <CustomButton
                            handle={handleAppointment}
                            label={'submit'}
                            variant={'contained'}
                            color={'secondary'}
                        />
                    </ButtonToolbar>
                </>
            }
        />
    );
}

export default LecturerAppointment;