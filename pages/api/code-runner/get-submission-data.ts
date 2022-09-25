import { gql } from '@apollo/client';
import { makeGraphqlMutation, makeGraphqlQuery } from 'apollo-client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = any;

const GET_SUBMISSION_INFO = {
  query: gql`
    query get_submission_info($submission_id: ID!) {
      get_submission_info(submission_id: $submission_id) {
        error_message
        error_code
        status
        submission {
          id
          user_id
          programming_language_id
          input
          code_content
          output
          error
          running_time
          memory_used
          created_at
          submission_status
        }
      }
    }
  `,
  fetchPolicy: 'network-only',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }
  const { submissionId }: { submissionId: string } = req.body;

  // console.log(
  //   'make graphql query ',
  //   submissionId,
  //   ' / ',
  //   req.headers.authorization,
  // );

  const result = await makeGraphqlQuery(
    GET_SUBMISSION_INFO,
    {
      submission_id: submissionId,
    },
    {
      headers: {
        authorization: req.headers.authorization,
      },
    },
  ).catch((err: Error) => {
    // console.log(err);
    console.log(err.message);
    return {
      data: {
        get_submission_info: {
          ...(err.message.toLowerCase().includes('authentication') ||
          err.message.toLowerCase().includes('authorization')
            ? {
                error_code: 'authentication_error',
                error_message: 'User not authenticated',
              }
            : {
                error_code: 'internal_server_error',
                error_message: 'Internal server error! Please try again later',
              }),
        },
      },
    };
  });

  if (result?.data?.get_submission_info?.error_message) {
    res.status(500).json({
      ...result?.data?.get_submission_info,
    });
  } else {
    res.status(201).json({
      ...result?.data?.get_submission_info,
    });
  }
}
