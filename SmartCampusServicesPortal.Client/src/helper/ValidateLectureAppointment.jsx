import { Schema} from 'rsuite';
import {errorMessages} from "@/utils/errorMessages.jsx";

const { StringType, NumberType, DateType} = Schema.Types;

const today = new Date();
today.setHours(0, 0, 0, 0);

const maxDate = new Date(today);
maxDate.setMonth(maxDate.getMonth() + 1);

const minStartTime = new Date();
minStartTime.setHours(8, 0, 0, 0);

const maxStartTime = new Date();
maxStartTime.setHours(16, 0, 0, 0)
export const modelAppointment = Schema.Model({
    subject: NumberType().isRequired(errorMessages.required),
    lecturer: NumberType().isRequired(errorMessages.required),
    purpose: StringType().isRequired(errorMessages.required),
    appointmentDate: DateType()
        .isRequired(errorMessages.required)
        .min(today, errorMessages.date.min)
        .max(maxDate, errorMessages.date.max),
    startTime: DateType()
        .isRequired(errorMessages.required)
        .min(minStartTime, errorMessages.appointmentTime.start)
        .max(maxStartTime, errorMessages.appointmentTime.start),       
    endTime: DateType()
        .isRequired(errorMessages.required)
        .addRule((value, data) => {
            if (!data.startTime || !value) return true;
            return new Date(value) > new Date(data.startTime);
        }, 'End Time must be after Start Time'),
});