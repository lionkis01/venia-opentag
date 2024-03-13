import { gql } from '@apollo/client';

const GET_CREDIT_QUERY = gql`
    query GetCreditByEmail($email: String) {
        getCreditByEmail(email: $email) {
            entity_id
            firstname
            lastname
            email
            credit
        }
    }
`;

export default {
    queries: {
        getCreditQuery: GET_CREDIT_QUERY
    },
    mutations: {}
};
