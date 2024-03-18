import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAccountInformationPage } from '../talons/AccountInformationPage/useAccountInformationPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import {GET_CUSTOMER_CREDIT} from '../Credit/credit.gql';

import defaultClasses from '@magento/venia-ui/lib/components/AccountInformationPage/accountInformationPage.module.css';
import AccountInformationPageOperations from '@magento/venia-ui/lib/components/AccountInformationPage/accountInformationPage.gql.js';
import {useQuery} from "@apollo/client";

const EditModal = React.lazy(() => import('./editModal'));

const AccountInformationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useAccountInformationPage({
        ...AccountInformationPageOperations
    });

    const {
        handleCancel,
        formErrors,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode,
        recaptchaWidgetProps
    } = talonProps;
    const { formatMessage } = useIntl();

    const {data: customerData } = useQuery(GET_CUSTOMER_CREDIT, {
        pollInterval: 1000
    });

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={
                    'Something went wrong. Please refresh and try again.'
                }
            />
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;
        const customerName = `${customer.firstname} ${customer.lastname}`;
        const passwordValue = '***********';

        pageContent = (
            <Fragment>
                <div className={classes.accountDetails}>
                    <div className={classes.lineItemsContainer}>
                        <span className={classes.nameLabel}>
                            <FormattedMessage
                                id={'global.name'}
                                defaultMessage={'Name'}
                            />
                        </span>
                        <span className={classes.nameValue}>
                            {customerName}
                        </span>
                        <span className={classes.emailLabel}>
                            <FormattedMessage
                                id={'global.email'}
                                defaultMessage={'Email'}
                            />
                        </span>
                        <span className={classes.emailValue}>
                            {customer.email}
                        </span>
                        <span className={classes.credit}>
                            <FormattedMessage
                                id={'global.credit'}
                                defaultMessage={'Credit'}
                            />
                        </span>
                        <span className={classes.credit}>
                            {customerData.customerCredit}
                        </span>
                        <span className={classes.passwordLabel}>
                            <FormattedMessage
                                id={'global.password'}
                                defaultMessage={'Password'}
                            />
                        </span>
                        <span className={classes.passwordValue}>
                            {passwordValue}
                        </span>
                    </div>
                    <div className={classes.editButtonContainer}>
                        <Button
                            className={classes.editInformationButton}
                            disabled={false}
                            onClick={showUpdateMode}
                            priority="normal"
                            data-cy="AccountInformationPage-editInformationButton"
                        >
                            <FormattedMessage
                                id={'global.editButton'}
                                defaultMessage={'Edit'}
                            />
                        </Button>
                    </div>
                </div>
                <Suspense fallback={null}>
                    <EditModal
                        formErrors={formErrors}
                        initialValues={customer}
                        isDisabled={isDisabled}
                        isOpen={isUpdateMode}
                        onCancel={handleCancel}
                        onChangePassword={handleChangePassword}
                        onSubmit={handleSubmit}
                        shouldShowNewPassword={shouldShowNewPassword}
                        recaptchaWidgetProps={recaptchaWidgetProps}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'accountInformationPage.titleAccount',
                    defaultMessage: 'Account Information'
                })}
            </StoreTitle>
            <div
                aria-live="polite"
                className={classes.title}
                data-cy="AccountInformationPage-title"
            >
                <FormattedMessage
                    id={'accountInformationPage.accountInformation'}
                    defaultMessage={'Account Information'}
                />
            </div>
            {errorMessage ? errorMessage : pageContent}
        </div>
    );
};

export default AccountInformationPage;
