import { Schema} from 'rsuite';

const { StringType } = Schema.Types;

export const model = Schema.Model({
    email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('This field is required.'),

    password: StringType().isRequired('This field is required.'),
});
  