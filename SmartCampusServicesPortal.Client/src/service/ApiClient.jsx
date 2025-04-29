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
    async getUser() {
        return await this.callApi('/api/auth/getUser', 'GET',{ cacheResponse: true });
    }
    async getUserTitles() {
        return await this.callApi('/api/auth/getUserTitles', 'GET',{ cacheResponse: true });
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

    async getSubjectAndCourseById(courseId) {
        return await this.callApi('/api/education/course/subjectsAndCourse', 'GET', {
            params: courseId ? { courseId } : null
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