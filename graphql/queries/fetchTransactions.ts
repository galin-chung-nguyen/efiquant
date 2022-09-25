import { gql } from "@apollo/client";
import { makeGraphqlQuery } from "../../apollo-client";

export const fetchTransactions = async (stock: string, jwtToken: string | null = null) => {
    try {
        const QUERY = {
            query: gql`
                query getMyTransactions($stock: String!){
                    getMyTransactions(stock: $stock){
                        user_id             
                        price               
                        quantity            
                        stock_code          
                        bidask_type         
                        matching_type
                        settle_date
                        validity_date
                        status
                        created_at
                        commission
                        executed_quantity
                        matching_price
                        matching_time
                        t2_at
                    }
                }
            `,
            fetchPolicy: 'network-only'
        };

        jwtToken = jwtToken ? jwtToken : localStorage.getItem('jwtToken');

        if (!jwtToken) throw new Error('Jwt Token not exists in localStorage!');

        const { data: { getMyTransactions: transactions } } = await makeGraphqlQuery(QUERY, {
            stock: stock
        }, {
            headers: {
                "authorization": jwtToken ? "Bearer " + jwtToken : ""
            }
        });

        return {
            transactions, jwtToken
        }
    } catch (err: any) {
        return {
            transactions: null,
            jwtToken: null
        }
    }
}
