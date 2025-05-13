export const errorMessages = {
    error: 'An error has occured please try again later',
    errorDefault: 'Something went wrong. Please try again.',
    errorServer: 'Server error. Please try again later.',
    errorForbidden: 'Access denied. Please contact support.',
    errorNotFound: 'Service not found. Try again later.',
    errorUnAuthorize:  'Username or password is incorrect.',
    errorBadRequest: 'Invalid request. Please check your input.',
    denyAccess: 'You do not have permission to perform this action.',
    required: 'This field is required.',
    email: {
        invalid: 'Please enter a valid email address'
    },
    date:{
        max: 'Date must be within 1 month from today',
        min: 'Date cannot be in the past'
    },
    time:{
        max: 'End Time must be at least 1 hour after Start Time and no later than 7:00 PM.',
        min: 'Start Time must be between 8:00 AM and 6:00 PM.'
    },
    appointmentTime:{
        max: 'End Time must be at least 1 hour after Start Time and no later than 7:00 PM.',
        min: 'Start Time must be between 8:00 AM and 4:00 PM.'
    }
};