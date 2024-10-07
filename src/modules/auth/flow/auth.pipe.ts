import * as Joi from 'joi';

import { JoiValidationPipe } from '../../common';
import { AuthData, AuthInput } from '../model';

export class AuthPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object<AuthInput>({
            // @todo When building input validation, also include regex
            // and other techniques for optimal security
            email: Joi.string().required().max(AuthData.NAME_LENGTH),
            password: Joi.string().required().max(AuthData.NAME_LENGTH),
        });
    }
}
