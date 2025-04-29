import { Schema} from 'rsuite';
import {errorMessages} from "@/utils/errorMessages.jsx";

const { StringType, NumberType, ArrayType} = Schema.Types;

export const model = Schema.Model({
    title: NumberType()
        .isRequired(errorMessages.title.required),
    firstname: StringType().isRequired(errorMessages.firstname.required),
    lastname: StringType().isRequired(errorMessages.lastname.required),
    email: StringType()
        .isEmail(errorMessages.email.invalid)
        .isRequired(errorMessages.email.required),
    phone: NumberType()
        .isRequired('Contact Number is required'),
    password: StringType()
        .isRequired(errorMessages.password.required)
        .proxy(['confirmPassword']),
    confirmPassword: StringType().equalTo('password'),
    course: NumberType()
        .isRequired('This field is required.'),
    subjects: ArrayType()
        .minLength(2, 'Please select at least subjects')
        .isRequired('This field is required.'),
});
  