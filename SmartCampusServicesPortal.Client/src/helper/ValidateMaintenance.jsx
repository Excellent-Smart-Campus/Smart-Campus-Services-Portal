import { Schema} from 'rsuite';
import {errorMessages} from "@/utils/errorMessages.jsx";

const { StringType, NumberType, ArrayType} = Schema.Types;

export const modelMaintenance = Schema.Model({
    room: NumberType()
        .isRequired(errorMessages.required),
    name: StringType().isRequired(errorMessages.required),
    description: StringType().isRequired(errorMessages.required),
});