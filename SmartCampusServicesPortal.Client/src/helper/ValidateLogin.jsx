import { Schema} from 'rsuite';
import {errorMessages} from "@/utils/errorMessages.jsx";

const { StringType } = Schema.Types;

export const model = Schema.Model({
    email: StringType()
        .isEmail(errorMessages.email.invalid)
        .isRequired(errorMessages.required),

    password: StringType().isRequired(errorMessages.required),
});
  