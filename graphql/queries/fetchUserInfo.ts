import { gql } from "@apollo/client";
import { makeGraphqlQuery } from "../../apollo-client";

export const fetchUserInfo = async (jwtToken: string | null = null) => {
    try {
        const QUERY = {
            query: gql`
                query getMyInfo{
                    getMyInfo{
                        id
                        username
                        first_name
                        middle_name
                        last_name
                        portfolio{
                            code
                            quantity
                        }
                        balance
                    }
                }
            `,
            fetchPolicy: 'network-only'
        };

        jwtToken = jwtToken ? jwtToken : localStorage.getItem('jwtToken');

        if (!jwtToken) throw new Error('Jwt Token not exists in localStorage!');

        const { data: { getMyInfo: user } } = await makeGraphqlQuery(QUERY, {}, {
            headers: {
                "authorization": jwtToken ? "Bearer " + jwtToken : ""
            }
        });

        return {
            user, jwtToken
        }
    } catch (err: any) {
        return {
            user: null,
            jwtToken: null
        }
    }
}