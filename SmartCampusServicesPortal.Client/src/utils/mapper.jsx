import {roomType} from "@/utils/constants.jsx";

function mapCoursesToOptions(courses) {
    if (!courses || !Array.isArray(courses)) return [];

    return courses.map(course => ({
        label: course.courseName ?? '',
        value: course.courseId ?? null,
    }));
}

function mapSubjectsToOptions(subjects) {
    if (!subjects || !Array.isArray(subjects)) return [];
    return subjects.map(subject => ({
        label: subject.isMandatory ? `${subject.subjectName} *` : subject.subjectName ?? '',
        value: subject.subjectId ?? null,
    }));
}

function mapTitlesToOptions(subjects) {
    if (!subjects || !Array.isArray(subjects)) return [];

    return subjects.map(subject => ({
        label: subject.description ?? '',
        value: subject.titleId ?? null,
    }));
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


export { 
    mapSubjectsToOptions, 
    mapCoursesToOptions,
    mapTitlesToOptions, 
    mapRoomsToOptions, 
    mapLecturersToOptions,
    filterStudyRooms
};
