import { Box, Typography, Grid } from '@mui/material';
import { ButtonToolbar} from 'rsuite';
import { CustomButton } from "@/components/CustomButton.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { useEducation } from "@/context/EducationContext.jsx";
import { useNavigate } from "react-router-dom";
import {constantRoutes} from "@/utils/constantRoutes.jsx";
import {userActions} from "@/utils/authEnums.jsx";
import CustomCard from "@/components/CustomCard.jsx";
import CustomAccordion from "@/components/CustomAccordion.jsx";
import MenuBookIcon from '@mui/icons-material/MenuBook';

function StudentIndex(){
    const { user, canAccess } = useAuth();
    const { enrolled, timeTable, getSubjectDetails } = useEducation()
    const navigate = useNavigate();
    
    console.log(enrolled);
    
    return(
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6"> 👋 Welcome, {user.name} </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }} order={{ xs: 0 }} sx={{ mt: 4 , display: { xs: 'none', sm: 'block' }}}>
                    <ButtonToolbar className="button-toolbar" >
                        <CustomButton 
                            label="Book Room" 
                            variant="contained" 
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.bookRoom)}
                        />
                        <CustomButton 
                            label="View Class Schedule" 
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.viewSchedule)}
                        />
                        <CustomButton
                            label="Request Maintenance" 
                            variant="contained" 
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.maintenanceRequest)}
                        />
                        <CustomButton 
                            label="Schedule Lecturer Appointment" 
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.lecturerAppointment)}
                        />
                    </ButtonToolbar>
                </Grid>
                
                <Grid  order={{ xs: 1}} size={{ xs: 12, md: 8 }}>
                    {enrolled.length > 0 ?
                        (
                            enrolled.map((course) => (
                                <CustomAccordion title={`${course.courseCode} - ${course.courseName}`} 
                                    icon={<MenuBookIcon color="secondary" fontSize="small" style={{display: 'flex'}} />} 
                                        expandIconText="View All">
                                    {
                                        Array.isArray(course.subjects) && course.subjects.length > 0 ? (
                                            <Grid container direction="column" spacing={2}>
                                                {course.subjects.map((subject) => (
                                                    <Grid key={subject?.subjectId} item>
                                                        <CustomCard
                                                            title={subject?.subjectName}
                                                            description={subject?.subjectCode}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                                                No subjects enrolled yet.
                                            </Typography>
                                        )
                                    }
                                </CustomAccordion>
                            ))
                        ) :
                        (
                            <Typography variant="body2" color="error" sx={{ px: 2, py: 1 }}>
                                have not enrolled for a course yet. Contact Admin if you need to enroll for a course.
                            </Typography>
                        )
                    }
                </Grid>
                
                <Grid  order={{ xs: 2 }} size={{ xs: 12, md: 4 }}>
                    
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentIndex;