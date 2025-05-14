const roomType = {
    StudyRoom: 1,
    LectureHall: 2,
    Lab1: 3,
    Lab2: 4,
    TechnicalLab: 5
};
const contactType = {
    Email: 1,
    CellPhone: 2,
}
const usersAndGroupsType = {
    Users: 0,
    Groups: 1
};
const maintenanceTypes = {
    Open: 0,
    Closed: 1
};

const stakeholderType = {
    Student:1,
    Lecture:2,
    Admin:3,
    Course:4
}

const status = {
    Pending: 1,
    Approved: 2,
    Rejected: 3,
    Open: 4,
    InProgress: 5,
    Resolved: 6
}

const days ={
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
}

const notificationTypeLabels = {
    1: 'Room Booking Request',
    2: 'Appointment Request',
    3: 'Maintenance Alert',
    4: 'Campus Announcement',
    5: 'Subject Notification',
    6: 'Direct Message'
};

export { 
    roomType, 
    contactType, 
    usersAndGroupsType, 
    maintenanceTypes, 
    days, 
    stakeholderType,
    status,
    notificationTypeLabels
};