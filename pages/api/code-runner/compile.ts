import { gql } from '@apollo/client';
import { makeGraphqlMutation } from 'apollo-client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = any;

const CREATE_SUBMISSION_MUTATION = gql`
  mutation create_submission($input: CreateSubmissionInput!) {
    create_submission(input: $input) {
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
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }
  const {
    code,
    customInput,
    languageId,
  }: { code: string; customInput: string; languageId: number } = req.body;

  if (languageId !== 63) {
    res.status(405).json({
      error_code: 'language_not_supported',
      error_message:
        'Oops! Currently Nodejs is the only language that is supported! Please choose Nodejs!',
    });
    return;
  }

  const result = await makeGraphqlMutation(
    CREATE_SUBMISSION_MUTATION,
    {
      input: {
        code: code || '',
        input: customInput || '',
        programming_language_id: languageId || 63,
      },
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
        create_submission: {
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

  console.log('Got an error');
  console.log(result);

  if (result?.data?.create_submission?.error_message) {
    res.status(500).json({
      ...result?.data?.create_submission,
    });
  } else {
    res.status(201).json({
      ...result?.data?.create_submission,
    });
  }
}
