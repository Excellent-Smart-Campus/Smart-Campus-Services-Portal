import { useEffect, useState, Fragment } from 'react';
import { Box, useMediaQuery, IconButton, Divider, CardActions, Card, CardContent, Typography, Collapse, 
    Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { stakeholderType } from "@/utils/constants.jsx";
import { useTheme } from '@mui/material/styles';
import { mapTitle } from '@/utils/mapper.jsx';
import { ExpandMore } from '@/helper/ExpandMore.jsx';
import { useAuth } from "@/context/AuthContext.jsx";
import { useEducation } from "@/context/EducationContext.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Loader from "@/components/Loader.jsx";
import ApiClient from '@/service/ApiClient';

const RegisteredStudents = () => {
    const { setLoading } = useAuth();
    const { fetchRegisteredStakeholders, loading, titles, registeredStakeholders} = useEducation();
    const [ openCourses, setCourses] = useState(null);
    const [ localLoading, setLocalLoading ] = useState(null);
    const [ openCourseSubjects, setCourseSubjects] = useState(null);
    const [ getSubjects, setSubjects ] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setLoading(false);
        const fetchData = async () => {
            await fetchRegisteredStakeholders(stakeholderType.Student);
        };
        fetchData();
    }, []);
    
    const handleStakeholderClick = async (stakeholder) =>{
        setLoading(true);
        if (stakeholder) {
            const response = await ApiClient.instance.getEnrolledSubject(stakeholder);
            setSubjects(response);
        }
        setLoading(false);
    }
    
    return (
        <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Admin', link: constantRoutes.protected.admin.index },
                            { label: 'Manage-registered-students', link: constantRoutes.protected.admin.registeredStudents},
                        ]}
                    />
                }
                title={'Manage Registered Students'}
            />

            <CustomContainer
                bgColor={!isMobile}
                children={
                    <Box sx={{ width: '100%'}}>
                        {isMobile ? (
                            <Box display="flex" flexDirection="column" gap={2}>
                                {Array.isArray(registeredStakeholders) && registeredStakeholders.length > 0 ? (
                                    registeredStakeholders.map((student, index) => (
                                        <Card key={index}>
                                            <CardContent>
                                                <Typography variant="h6">{student.firstName} {student.lastName}</Typography>
                                                <Typography variant="body2">{student.title}</Typography>
                                                <Typography variant="body2" >
                                                    Total Modules Registered: {student.moduleCount}
                                                </Typography>
                                                <Box display={'flex'} sx={{my: '0.5rem'}} justifyContent={'space-between'}>
                                                    <Box justifyContent={'center'}
                                                        sx={{
                                                            p: '0.5em',
                                                            bgcolor: student.moduleCount <= 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
                                                            color: student.moduleCount <= 0 ? 'red' : 'green',
                                                            width: '40%',
                                                            textAlign: 'center',
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        {student.moduleCount <= 0 ? 'Inactive' : 'Active'}
                                                    </Box>
                                                    <ExpandMore
                                                        expand={openCourses === index ? true : false}
                                                        onClick={() => {
                                                            handleStakeholderClick(student.stakeholderId);
                                                            setCourses(openCourses === index ? null : index)
                                                        }}
                                                        aria-expanded={openCourses === index ? true : false}
                                                        aria-label="show more"
                                                    >
                                                        <ExpandMoreIcon />
                                                    </ExpandMore>
                                                </Box>
                                                
                                                <Collapse in={openCourses === index} timeout="auto" unmountOnExit>
                                                    {getSubjects.map((course, courseIdx) => (
                                                        <Box key={`course-collapse-${courseIdx}`}>
                                                            <Divider sx={{mb: '1rem'}} />
                                                            <Typography variant="body2">Course Code: {course.courseCode}</Typography>
                                                            <Typography variant="body2">Course Name: {course.courseName}</Typography>
                                                                {course.subjects.map((subject, subjIdx) => (
                                                                     <Box key={`subject-collapse-${subjIdx}`}>
                                                                        <Divider sx={{my: '1rem'}} />
                                                                        <Typography variant="body2">Subject Code: {subject.subjectCode}</Typography>
                                                                        <Typography variant="body2">Subject Name: {subject.subjectName}</Typography>
                                                                    </Box>
                                                                ))}
                                                        </Box>
                                                    ))}
                                                </Collapse>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card >
                                        <CardContent>
                                            <Typography variant="body1" color="textSecondary">
                                                No registered students found or failed to load data.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                         <TableCell></TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>Total Modules Registered</TableCell>
                                        <TableCell>Student Active</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {registeredStakeholders && registeredStakeholders.length > 0 ? (
                                        registeredStakeholders.map((student, index) => (  
                                            <Fragment key={index}>
                                                <TableRow key={`lecturer-row-${index}`}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                                    }}>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => {
                                                                handleStakeholderClick(student.stakeholderId);
                                                                setCourses(openCourses === index ? null : index)
                                                            }}
                                                        >
                                                            {openCourses === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{mapTitle(titles, student.titleId)}</TableCell>
                                                    <TableCell>{student.firstName}</TableCell>
                                                    <TableCell>{student.lastName}</TableCell>
                                                    <TableCell>{student.moduleCount}</TableCell>
                                                    <TableCell>
                                                        <Box justifyContent={'center'}
                                                            sx={{
                                                                p: '0.5em',
                                                                bgcolor: student.moduleCount <= 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
                                                                color: student.moduleCount <= 0 ? 'red' : 'green',
                                                                width: '50%',
                                                                textAlign: 'center',
                                                                borderRadius: '4px',
                                                            }}
                                                        >
                                                            {student.moduleCount <= 0 ? 'Inactive' : 'Active'}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow key={`student-collapse-${index}`}>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                        <Collapse in={openCourses === index} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Typography variant="h6" gutterBottom component="div">
                                                                    Course
                                                                </Typography>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell></TableCell>
                                                                            <TableCell>Course Code</TableCell>
                                                                            <TableCell>Course Name</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {getSubjects.map((course, index) => (
                                                                            <Fragment key={index}>
                                                                                <TableRow key={`student-sub-${index}`}
                                                                                    sx={{
                                                                                        '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                                                                    }}>
                                                                                    <TableCell>
                                                                                        <IconButton
                                                                                            aria-label="expand row"
                                                                                            size="small"
                                                                                            onClick={() => {
                                                                                                setCourseSubjects(openCourseSubjects === index ? null : index);
                                                                                            }}
                                                                                        >
                                                                                            {openCourseSubjects === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                                        </IconButton>
                                                                                    </TableCell>
                                                                                    <TableCell>{course.courseCode}</TableCell>
                                                                                    <TableCell>{course.courseName}</TableCell>
                                                                                </TableRow>
                                                                            
                                                                                <TableRow key={`student-sub-collapse-${index}`}>
                                                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                                                        <Collapse in={openCourseSubjects === index} timeout="auto" unmountOnExit>
                                                                                            <Box sx={{ margin: 1 }}>
                                                                                                <Typography variant="h6" gutterBottom component="div">
                                                                                                    Subjects
                                                                                                </Typography>
                                                                                                <Table>
                                                                                                    <TableHead>
                                                                                                        <TableRow>
                                                                                                            <TableCell>Subject Code</TableCell>
                                                                                                            <TableCell>Subject Name</TableCell>
                                                                                                        </TableRow>
                                                                                                    </TableHead>
                                                                                                    <TableBody>
                                                                                                        {course.subjects.map((subject, index) => (
                                                                                                            <TableRow key={index}
                                                                                                                sx={{
                                                                                                                    '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                                                                                                }}>
                                                                                                                <TableCell>{subject.subjectCode}</TableCell>
                                                                                                                <TableCell>{subject.subjectName}</TableCell>
                                                                                                            </TableRow>
                                                                                                        ))}
                                                                                                    </TableBody>
                                                                                                </Table>
                                                                                            </Box>
                                                                                        </Collapse>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            </Fragment>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </Fragment>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No registered students found or failed to load data.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                }
            />
        </Box>
    );
};
export default RegisteredStudents;