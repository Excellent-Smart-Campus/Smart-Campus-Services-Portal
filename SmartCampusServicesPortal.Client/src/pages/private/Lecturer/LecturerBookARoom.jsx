import  {useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { userActions } from "@/utils/authEnums";
import { Box, Tabs, Tab} from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { modelBookingRoom } from '@/helper/ValidateBookingRoom.jsx';
import { BookRoomForm } from "@/forms/BookRoomForm.jsx";
import { ButtonToolbar } from 'rsuite';
import { useEducation } from "@/context/EducationContext.jsx";
import { useService } from "@/context/ServiceContext.jsx";
import { formatTimeOnly } from "@/utils/formatTimeOnly.jsx";
import { getErrorMessageFromResponse } from "@/utils/getErrorMessageFromResponse.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { Error, Success } from "@/helper/Toasters.jsx";
import { filterStudyRooms } from  '@/utils/mapper.jsx';
import AccessGuard from "@/components/AccessGuard.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomButton from "@/components/CustomButton.jsx";
import CustomTabPanel from "@/components/CustomTabPanel.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import ApiClient from '@/service/ApiClient';
const LecturerBookARoom = () => {
    const { setLoading } = useAuth();
    const { enrolled } = useEducation()
    const { rooms } = useService();
    const navigate = useNavigate();
    const bookRoomFormRef = useRef();
    const [bookForm, setBookForm] = useState({
        room: null, purpose: '', bookingDate: '', startTime: null, endTime: null});
    const [value, setValue] = useState(0);

    useEffect(() => {
        setLoading(false);
    }, []);
    
    const handleRoomBooking = async e => {
        setLoading(true);
        e.preventDefault();
        if (!bookRoomFormRef.current.check()) {
            setLoading(false);
            return;
        }

        let userData = {
            room: bookForm.room,
            purpose: bookForm.purpose,
            bookingDate: bookForm.bookingDate,
            startTime: formatTimeOnly(bookForm.startTime),
            endTime: formatTimeOnly(bookForm.endTime)
        }
        try {
            const response = await ApiClient.instance.bookARoom(userData);
            Success(response.message);
            navigate(constantRoutes.protected.index);
        } catch (e) {
            Error(getErrorMessageFromResponse(e));
        } finally{
            setLoading(false);
        }
    }
    
    const tabData = [
        { label: 'View Available slot',
            content:
                <div>Overview Content</div>
        },
        { label: 'Book a room',
            content:
                <>
                    <BookRoomForm
                        formRef={bookRoomFormRef}
                        setFormValue={setBookForm}
                        formValue={bookForm}
                        model={modelBookingRoom}
                        roomOptions={filterStudyRooms(rooms)}
                    />
                    
                    <ButtonToolbar  className="button-toolbar" style={{marginTop: "2em"}}>
                        <CustomButton
                            handle={()=> navigate(constantRoutes.protected.index)}
                            label={'cancel'}
                            variant={'contained'}
                            color={'primary'}
                        />
                        <CustomButton
                            handle={handleRoomBooking}
                            label={'submit'}
                            variant={'contained'}
                            color={'secondary'}
                        />
                    </ButtonToolbar>
                </>
        },
    ];
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <AccessGuard accessKey={userActions.BOOK_A_ROOM}>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Lecturer', link: constantRoutes.protected.index },
                            { label: 'Booking', link: constantRoutes.protected.lecturer.lecturerAppointment},
                        ]}
                    />
                }
                title={'Booking Room Content'}
                children={
                    <Box sx={{ width: '100%'}}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%'}}>
                            <Tabs textColor="secondary" indicatorColor="secondary" 
                                  value={value} onChange={handleChange} aria-label="dynamic tabs">
                                {tabData.map((tab, index) => (
                                    <Tab
                                        key={index}
                                        label={tab.label}
                                        id={`tab-${index}`}
                                        aria-controls={`tabpanel-${index}`}
                                    />
                                ))}
                            </Tabs>
                            {tabData.map((tab, index) => (
                                <CustomTabPanel
                                    key={index}
                                    value={value}
                                    index={index}
                                    children={tab?.content}
                                />
                            ))}
                        </Box>
                    </Box>
                }
            />
        </AccessGuard>
    );
};

export default LecturerBookARoom;
