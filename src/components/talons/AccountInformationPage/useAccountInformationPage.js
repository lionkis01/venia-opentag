import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

export const useAccountInformationPage = props => {
    const {
        mutations: {
            setCustomerInformationMutation,
            changeCustomerPasswordMutation
        },
        queries: { getCustomerInformationQuery }
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const [shouldShowNewPassword, setShouldShowNewPassword] = useState(false);

    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const [, { dispatch }] = useEventingContext();

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const { data: accountInformationData, error: loadDataError } = useQuery(
        getCustomerInformationQuery,
        {
            skip: !isSignedIn,
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [
        setCustomerInformation,
        {
            error: customerInformationUpdateError,
            loading: isUpdatingCustomerInformation
        }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        {
            error: customerPasswordChangeError,
            loading: isChangingCustomerPassword
        }
    ] = useMutation(changeCustomerPasswordMutation);

    const {
        generateReCaptchaData,
        recaptchaLoading,
        recaptchaWidgetProps
    } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_EDIT',
        formAction: 'editCustomer'
    });

    console.log(accountInformationData)

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    const handleChangePassword = useCallback(() => {
        setShouldShowNewPassword(true);
    }, [setShouldShowNewPassword]);

    const handleCancel = useCallback(() => {
        setIsUpdateMode(false);
        setShouldShowNewPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);

        // If there were errors from removing/updating info, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [setIsUpdateMode]);

    const handleSubmit = useCallback(
        async ({ email, firstname, lastname, credit, password, newPassword }) => {
            try {
                email = email.trim();
                firstname = firstname.trim();
                lastname = lastname.trim();
                password = password.trim();
                credit = credit.trim();
                newPassword = newPassword ? newPassword.trim() : newPassword;

                if (
                    initialValues.customer.email !== email ||
                    initialValues.customer.firstname !== firstname ||
                    initialValues.customer.lastname !== lastname ||
                    initialValues.customer.credit !== credit
                ) {
                    await setCustomerInformation({
                        variables: {
                            customerInput: {
                                email,
                                firstname,
                                lastname,
                                credit,
                                // You must send password because it is required
                                // when changing email.
                                password
                            }
                        }
                    });
                }
                if (password && newPassword) {
                    const recaptchaDataForChangeCustomerPassword = await generateReCaptchaData();
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: password,
                            newPassword: newPassword
                        },
                        ...recaptchaDataForChangeCustomerPassword
                    });
                }

                dispatch({
                    type: 'USER_ACCOUNT_UPDATE',
                    payload: {
                        email,
                        firstName: firstname,
                        lastName: lastname
                    }
                });

                // After submission, close the form if there were no errors.
                handleCancel(false);
            } catch {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);

                // we have an onError link that logs errors, and FormError
                // already renders this error, so just return to avoid
                // triggering the success callback
                return;
            }
        },
        [
            initialValues,
            handleCancel,
            setCustomerInformation,
            generateReCaptchaData,
            changeCustomerPassword,
            dispatch
        ]
    );

    const errors = displayError
        ? [customerInformationUpdateError, customerPasswordChangeError]
        : [];

    return {
        handleCancel,
        formErrors: errors,
        handleSubmit,
        handleChangePassword,
        initialValues,
        isDisabled:
            isUpdatingCustomerInformation ||
            isChangingCustomerPassword ||
            recaptchaLoading,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode,
        recaptchaWidgetProps
    };
};
