import { useState} from 'react';
import { Box, Modal, Backdrop, Fade, Typography} from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { ButtonToolbar } from 'rsuite';
import { useEducation } from "@/context/EducationContext.jsx";
import { mapToEvents } from '@/utils/mapper.jsx';
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import CustomButton from "@/components/CustomButton.jsx";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from  '@fullcalendar/timegrid';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Schedule = () => {
    const {timeTable } = useEducation();
    const [formValue, setFormValue] = useState({title: null, extendedProps: {}, end: null, start: null});
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const events = mapToEvents(timeTable)

    const handleDownload = (events) => {
        if (!events?.length) return;

        const headers = ['Title', 'Start Time', 'End Time', 'Room', 'Room Type'];
        const rows = events.map(ev => [
            ev.title,
            new Date(ev.start).toLocaleString(),
            new Date(ev.end).toLocaleString(),
            ev.extendedProps.room || '',
            ev.extendedProps.roomType || ''
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(value => `"${value}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "timetable.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleModelClick = (info) => {
        const { title, start, end, extendedProps } = info.event;
        setFormValue({
            title: title,
            extendedProps: extendedProps,
            start: start,
            end: end,
        });
        setOpen(true)
    }

    return (
        <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Home', link: constantRoutes.protected.index },
                            { label: 'View-Schedule', link: constantRoutes.protected.student.viewSchedule},
                        ]}
                    />
                }
                title={'Monthly Schedule'}
                children={   
                    <ButtonToolbar style={{marginBlock: '1.5rem' }} >
                        <CustomButton
                            handle={() => handleDownload}
                            label={'Download time table'}
                            variant={'contained'}
                            color={'primary'}
                        />
                    </ButtonToolbar>
                }
            />

            <CustomContainer
                children={
                    <Box sx={{ width: '100%'}}>
                        <div className="myCustomHeight">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="dayGridMonth"
                                weekends={false}
                                events={events}
                                headerToolbar={{
                                    left: '',
                                    center: 'title',
                                    right: ''
                                }}
                                allDaySlot={false}

                                eventClick={(info) => handleModelClick(info)}   
                            />
                        </div>
                    </Box>
                }
            />

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography  variant="h6" component="h2">
                            {formValue.title}
                        </Typography>                        
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default Schedule;