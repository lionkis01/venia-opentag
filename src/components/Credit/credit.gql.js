import { gql } from '@apollo/client';

export const GET_CUSTOMER_CREDIT = gql`
    query getCustomerCredit {
        customerCredit
    }
`;
