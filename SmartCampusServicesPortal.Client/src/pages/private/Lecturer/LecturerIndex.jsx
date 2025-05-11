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

function LecturerIndex(){
    const { user, canAccess } = useAuth();
    const { enrolled, timeTable, getSubjectDetails } = useEducation()
    const navigate = useNavigate();
    
    const handleSubjectView = async (subject) => {
        if (!canAccess(userActions.STUDENT_ENROLLMENT_SUBJECT)) {
            navigate(constantRoutes.access.unauthorised);
        }
        navigate(constantRoutes.protected.student.subject, {
            state: { subject },
        });
    };
    
    return(
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6"> 👋 Welcome, {user.name} </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12}} order={{ xs: 0 }} sx={{ mt: 4 }}>
                    <ButtonToolbar className="button-toolbar" >
                        <CustomButton
                            label="Book Room"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.bookRoom)}
                        />
                        <CustomButton
                            label="View Class Schedule"
                            variant="contained"
                            color="primary"
                        />
                        <CustomButton
                            label="Request Maintenance"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.maintenanceRequest)}
                        />
                        <CustomButton
                            label="Manage Appointments"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.manageAppointents)}
                        />
                    </ButtonToolbar>
                </Grid>

                <Grid item order={{ xs: 1}} size={{ xs: 12, md: 8 }}>
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
                                                            onClick={() => handleSubjectView(subject)}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                                                You have not been assigned any modules yet.
                                            </Typography>
                                        )
                                    }
                                </CustomAccordion>
                            ))
                        ) :
                        (
                            <Typography variant="body2" color="error" sx={{ px: 2, py: 1 }}>
                                No assigned course or subject found. 
                                This lecturer has not yet been assigned any subjects to manage.
                            </Typography>
                        )
                    }
                </Grid>

                <Grid item order={{ xs: 2 }} size={{ xs: 12, md: 4 }}>
                    <CustomAccordion title="Enrolled Courses" expandIconText="View All">

                    </CustomAccordion>

                </Grid>
            </Grid>
        </Box>
    );
}

export default LecturerIndex;