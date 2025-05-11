import axios from 'axios';
class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: '',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        });
        this.cache = {};
    }
    
    async callApi(path, method, { cacheResponse = true, data = null, params = null } = {}) {
        const cacheKey = this.buildCacheKey(path, params);

        if (method.toUpperCase() === 'GET' && cacheResponse && this.cache[cacheKey]) {
            console.log(`Returning cached data for ${cacheKey}`);
            return JSON.parse(this.cache[cacheKey]);
        }

        const response = await this.client.request({
            url: path,
            method: method,
            data: data,
            params: params,
        });

        if (method.toUpperCase() === 'GET' && cacheResponse) {
            this.cache[cacheKey] = JSON.stringify(response.data);
        }

        return response.data;
    }
    
    buildCacheKey(path, params) {
        if (!params) return path;
        const searchParams = new URLSearchParams(params).toString();
        return `${path}?${searchParams}`;
    }
    
    async getProfile() {
        return await this.callApi('/api/auth/userProfile', 'GET',{ cacheResponse: true });
    }
    
    async getUserTitles() {
        return await this.callApi('/api/auth/getUserTitles', 'GET',{ cacheResponse: true });
    }
    
    async getRooms() {
        return await this.callApi('/api/service/getRooms', 'GET',{ cacheResponse: true });
    }
    
    async getCourseById(courseId) {
        return await this.callApi('/api/education/course/list', 'GET', {
            cacheResponse: !courseId, // cache only if no courseId
            params: courseId ? { courseId } : null
        });
    }
    
    async getSubjectsCourseById(courseId) {
        return await this.callApi('/api/education/course/subjects', 'GET', {
            params: courseId ? { courseId } : null
        });
    }
    
    async getSubjectLecturers(subjectId) {
        return await this.callApi('/api/education/subject/subjectLecturers', 'GET', {
            cacheResponse: false,
            params: subjectId ? { subjectId } : null
        });
    }
    
    async getTimeTable(){
        return await this.callApi('/api/education/course/timetable', 'GET');
    }
    
    async getEnrolledSubject(){
        return await this.callApi('/api/education/course/enrolledSubject', 'GET');
    }
    
    async getUserAuthenticated(){
        return await this.callApi('/api/auth/userAuthenticated', 'GET',{ cacheResponse: false });
    }
    
    async availableBooking(year, month){
        return await this.callApi('/api/service/availableBooking', 'POST',{
            cacheResponse: false,
            data: {
                Year: year,
                Month: month
            },
        });
    }
    
    async requestMaintenance(name, room, description){
        return await this.callApi('/api/service/maintenanceRequest', 'POST',{
            cacheResponse: false,
            data: {
                Name: name,
                Room: room,
                Description : description
            },
        });
    }
    
    async scheduleAppointment(formData){
        return await this.callApi('/api/service/scheduleAppointment', 'POST',{
            cacheResponse: false,
            data: {
                Lecturer: formData.lecturer,
                Purpose : formData.purpose,
                AppointmentDate: formData.appointmentDate,
                StartTime: formData.startTime,
            },
        });
    }
    
    async bookARoom(formData){
        return await this.callApi('/api/service/bookARoom', 'POST',{
            cacheResponse: false,
            data: {
                Room: formData.room,
                Purpose : formData.purpose,
                BookingDate: formData.bookingDate,
                StartTime: formData.startTime,
                EndTime: formData.endTime,
            },
        });
    }

    async getSystemPermission() {
        return await this.callApi('/api/admin/getSystemPermission', 'GET',{ cacheResponse: true });
    }

    async getGroupActions(groupId) {
        return await this.callApi('/api/admin/getGroupActions', 'GET',{
            cacheResponse: false ,
            params: { groupId }
        });
    }
    
    async getAllUsers() {
        return await this.callApi('/api/admin/getAllUsers', 'GET',{ cacheResponse: false });
    }

    async lockUser(stakeholder, isLocked){
        return await this.callApi('/api/admin/lockUser', 'POST', {
            cacheResponse: false,
            data: {
                Stakeholder: stakeholder, 
                IsLocked: isLocked
            }
        });
    }
    
    async getUser(stakeholder){
        return await this.callApi('/api/admin/getUser', 'GET',
        { 
            cacheResponse: false,
            params: { stakeholder }
        });
    }

    async getGroup(groupId) {
        return await this.callApi('/api/admin/getGroup', 'GET', {
            params: groupId ? { groupId } : null
        });    
    }
    
    async logout() {
        return await this.callApi('/api/auth/logout', 'POST', { cacheResponse: false });
    }
    
    async login(email, password) {
        return await this.callApi('/api/auth/login', 'POST',{
            cacheResponse: false,
            data: {
                Username: email,
                Password: password
            },
        });
    }
    
    async register(formData) {
        return await this.callApi('/api/auth/register', 'POST', {
            cacheResponse: false,
            data: {
                Title: formData.title,
                FirstName: formData.firstname,
                LastName: formData.lastname,
                Email: formData.email,
                Password: formData.password,
                ConfirmPassword: formData.confirmPassword,
                MobileNumber: formData.phone,
                Subjects: formData.subjects,
                Course: formData.course,
            }
        });
    }
}

ApiClient.instance = new ApiClient();
export default ApiClient;