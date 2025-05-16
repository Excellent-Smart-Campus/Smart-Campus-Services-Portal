import { roomType, days } from "@/utils/constants.jsx";
import { status} from "@/utils/constants.jsx";

function mapCoursesToOptions(courses) {
    if (!courses || !Array.isArray(courses)) return [];

    return courses.map(course => ({
        label: course.courseName ?? '',
        value: course.courseId ?? null,
    }));
}

const statusDescription = Object.fromEntries(
    Object.entries(status).map(([key, value]) => {
        if (key === "InProgress") {
            return [value, "In Progress"];
        }
        return [value, key];
    })
);
function mapSubjectsToOptions(courses) {
    if (!courses || !Array.isArray(courses)) return [];
    return  courses.flatMap(course => 
        (course.subjects || []).map( subject => ({
            label: subject.isMandatory ? `${subject.subjectName} *` : subject.subjectName ?? '', 
            value: subject.subjectId ?? null,
        }))
    );
}


function formatServerDate(isoString) {
    const date = new Date(isoString);

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    return date.toLocaleString('en-ZA', options);
}


function formatServerTime(timeString) {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));

    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function formatServerDateOnly(isoString) {
    const date = new Date(isoString);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleString('en-ZA', options);
}
    

function mapTitlesToOptions(titles) {
    if (!titles || !Array.isArray(titles)) return [];

    return titles.map(title => ({
        label: title.description ?? '',
        value: title.titleId ?? null,
    }));
}

function mapTitle(titleOptions, title){
    if (!titleOptions || !Array.isArray(titleOptions)) return '';
    if (!title) return '';

    return titleOptions.find(titleOption => titleOption.titleId === Number(title))?.description;
}


function mapRoom(roomOptions, room){
    if (!roomOptions || !Array.isArray(roomOptions)) return '';
    if (!room) return '';

    return roomOptions.find(roomOption => roomOption.roomId === Number(room));
}

function filterStudyRooms(roomList){
    if (!roomList || !Array.isArray(roomList)) return [];
    return roomList.filter(s =>
         s?.roomTypeId !== roomType.StudyRoom);
}
function mapLecturersToOptions(lecturerOptions) {
    if (!lecturerOptions || !Array.isArray(lecturerOptions)) return [];

    return lecturerOptions.map(lecturer => ({
        label: lecturer.name ?? '',
        value: lecturer.lecturer ?? null,
    }));
}


function mapRoomsToOptions(rooms){
    if (!rooms || !Array.isArray(rooms)) return [];

    return rooms.map(room => ({
        label: `${room.roomNumber} - ${room.roomName} `?? '',
        value: room.roomId ?? null,
    }));
}

const mapToEvents = (course) => {

    if (!course || !Array.isArray(course.weekDays)) {
        return []
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const events = [];

    course.weekDays.forEach(day => {
        const dayIndex = days[day.dayOfWeekType];
        if (dayIndex === undefined || !Array.isArray(day.schedules)) return;

        const date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            if (date.getDay() === dayIndex) {
                const eventDate = new Date(date); // clone

                day.schedules.forEach(schedule => {
                    const [startH = 0, startM = 0, startS = 0] = (schedule.startTime || '').split(':').map(Number);
                    const [endH = 0, endM = 0, endS = 0] = (schedule.endTime || '').split(':').map(Number);

                    const startDate = new Date(eventDate);
                    startDate.setHours(startH, startM, startS);

                    const endDate = new Date(eventDate);
                    endDate.setHours(endH, endM, endS);

                    events.push({
                        title: schedule.subjectCode || "No Title",
                        start: startDate,
                        end: endDate,
                        extendedProps: {
                            name: schedule.subjectName,
                            course: course.courseCode,
                            room: schedule.roomNumber,
                            roomType: schedule.roomType,
                        }
                    });
                });
            }
            date.setDate(date.getDate() + 1);
        }
    });
    return events;
}

function getAllDatesForDay(dayName, year, month) {
  const dates = [];
  const dayNumber = dayMap[dayName];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    if (date.getDay() === dayNumber) {
      dates.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

export { 
    mapSubjectsToOptions, 
    mapCoursesToOptions,
    mapTitlesToOptions, 
    mapRoomsToOptions, 
    mapLecturersToOptions,
    filterStudyRooms,
    mapToEvents,
    mapTitle,
    statusDescription,
    mapRoom,
    formatServerDate,
    formatServerDateOnly,
    formatServerTime
};
