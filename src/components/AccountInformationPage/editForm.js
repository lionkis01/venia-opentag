import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Password from '@magento/venia-ui/lib/components/Password';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField
} from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import defaultClasses from '@magento/venia-ui/lib/components/AccountInformationPage/editForm.module.css';

const EditForm = props => {
    const {
        classes: propClasses,
        handleChangePassword,
        shouldShowNewPassword
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const maybeNewPasswordField = shouldShowNewPassword ? (
        <div className={classes.newPassword}>
            <Password
                fieldName="newPassword"
                label={formatMessage({
                    id: 'global.newPassword',
                    defaultMessage: 'New Password'
                })}
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, 8],
                    validatePassword,
                    [isNotEqualToField, 'password']
                ])}
                isToggleButtonHidden={false}
                data-cy="newPassword"
            />
        </div>
    ) : null;

    const maybeChangePasswordButton = !shouldShowNewPassword ? (
        <div
            className={classes.changePasswordButtonContainer}
            data-cy="editForm-changePasswordButtonContainer"
        >
            <LinkButton
                classes={classes.changePasswordButton}
                type="button"
                onClick={handleChangePassword}
                data-cy="linkButton-root"
            >
                <FormattedMessage
                    id={'global.changePassword'}
                    defaultMessage={'Change Password'}
                />
            </LinkButton>
        </div>
    ) : null;

    const passwordLabel = shouldShowNewPassword
        ? formatMessage({
            id: 'global.currentPassword',
            defaultMessage: 'Current Password'
        })
        : formatMessage({
            id: 'global.password',
            defaultMessage: 'Password'
        });
    return (
        <Fragment>
            <div className={classes.root}>
                <div className={classes.firstname}>
                    <Field
                        id="firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            field="firstname"
                            validate={isRequired}
                            data-cy="firstname"
                        />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field
                        id="lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            field="lastname"
                            validate={isRequired}
                            data-cy="lastname"
                        />
                    </Field>
                </div>
                <div className={classes.email}>
                    <Field
                        id="email"
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'Email'
                        })}
                    >
                        <TextInput
                            field="email"
                            validate={isRequired}
                            data-cy="email"
                        />
                    </Field>
                </div>
                <div className='credit'>
                    <Field
                        id="credit"
                        label={formatMessage({
                            id: 'global.credit',
                            defaultMessage: 'Credit'
                        })}
                    >
                        <TextInput
                            field="credit"
                            validate={isRequired}
                            data-cy="credit"
                        />
                    </Field>
                </div>
                <div className={classes.password}>
                    <Password
                        fieldName="password"
                        label={passwordLabel}
                        validate={isRequired}
                        autoComplete="current-password"
                        isToggleButtonHidden={false}
                        data-cy="password"
                    />
                </div>
                {maybeNewPasswordField}
            </div>
            {maybeChangePasswordButton}
        </Fragment>
    );
};

export default EditForm;

EditForm.propTypes = {
    classes: shape({
        changePasswordButton: string,
        changePasswordButtonContainer: string,
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        buttons: string,
        passwordLabel: string,
        password: string,
        newPassword: string
    })
};
