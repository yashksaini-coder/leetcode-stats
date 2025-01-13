import { Response } from 'express';
import { ProblemSetQuestionListData } from '../src/types';

const fetchProblems = async (
  options: { limit?: number; skip?: number; tags?: string; difficulty?: string}, // Mark parameters as optional
  res: Response,
  formatData: (data: ProblemSetQuestionListData) => {},
  query: string
) => {
  try {
    // Set default limit to 1 if only skip is provided
    const limit = options.skip !== undefined && options.limit === undefined ? 1 : options.limit || 20;
    const skip = options.skip || 0; // Default to 0 if not provided
    const tags = options.tags ? options.tags.split(' ') : []; // Split tags or default to empty array
    const difficulty = options.difficulty || undefined; // difficulty has to be 'EASY', 'MEDIUM' or 'HARD'

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          categorySlug: '',
          skip,
          limit,
          filters: { tags,
            difficulty
           },
        },
      }),
    });
    console.log(response)

    const result = await response.json();

    if (result.errors) {
      return res.status(400).json(result.errors); // Return errors with a 400 status code
    }
    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return res.status(500).json({ error: 'Internal server error' }); // Return a 500 status code for server errors
  }
};

export default fetchProblems;