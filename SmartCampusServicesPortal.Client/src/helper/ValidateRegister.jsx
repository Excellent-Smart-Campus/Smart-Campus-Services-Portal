import { Schema} from 'rsuite';
import {errorMessages} from "@/utils/errorMessages.jsx";

const { StringType, NumberType, ArrayType} = Schema.Types;

export const model = Schema.Model({
    title: NumberType()
        .isRequired(errorMessages.required),
    firstname: StringType().isRequired(errorMessages.required),
    lastname: StringType().isRequired(errorMessages.required),
    email: StringType()
        .isEmail(errorMessages.email.invalid)
        .isRequired(errorMessages.required),
    phone: NumberType()
        .isRequired(errorMessages.required),
    password: StringType()
        .isRequired(errorMessages.required)
        .proxy(['confirmPassword']),
    confirmPassword: StringType().equalTo('password'),
    course: NumberType()
        .isRequired(errorMessages.required),
    subjects: ArrayType()
        .minLength(2, 'Please select at least subjects')
        .isRequired(errorMessages.required),
});
  