import { Request, Response } from 'express';
import * as gqlQueries from './GQLQueries';
import * as formatUtils from '../utils';
import * as controllers from '../controllers';
import { TransformedUserDataRequest } from './types';

export const userData = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatUserData,
    gqlQueries.userProfileQuery
  );
};

export const userBadges = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatBadgesData,
    gqlQueries.userProfileQuery
  );
};

export const userContest = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatContestData,
    gqlQueries.contestQuery
  );
};

export const userContestHistory = (
  req: TransformedUserDataRequest,
  res: Response
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatContestHistoryData,
    gqlQueries.contestQuery
  );
};

export const solvedProblem = (
  req: TransformedUserDataRequest,
  res: Response
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatSolvedProblemsData,
    gqlQueries.userProfileQuery
  );
};

export const submission = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatSubmissionData,
    gqlQueries.submissionQuery
  );
};

export const acSubmission = (
  req: TransformedUserDataRequest,
  res: Response
) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatAcSubmissionData,
    gqlQueries.AcSubmissionQuery
  );
};

export const calendar = (req: TransformedUserDataRequest, res: Response) => {
  controllers.fetchUserDetails(
    req.body,
    res,
    formatUtils.formatSubmissionCalendarData,
    gqlQueries.userProfileQuery
  );
};

//Problems Details
export const dailyProblem = (_req: Request, res: Response) => {
  controllers.fetchSingleProblem(
    res,
    formatUtils.formatDailyData,
    gqlQueries.dailyProblemQuery,
    null
  );
};

export const selectProblem = (req: Request, res: Response) => {
  const title = req.query.titleSlug as string;
  if (title !== undefined) {
    controllers.fetchSingleProblem(
      res,
      formatUtils.formatQuestionData,
      gqlQueries.selectProblemQuery,
      title
    );
  } else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: titleSlug',
      solution: 'put query after select',
      example: 'localhost:3000/select?titleSlug=two-sum',
    });
  }
};

export const problems = (
  req: Request<{}, {}, {}, { limit: number; skip: number; tags: string; difficulty: string }>,
  res: Response
) => {
  const difficulty=req.query.difficulty;
  const limit = req.query.limit;
  const skip = req.query.skip;
  const tags = req.query.tags;

  controllers.fetchProblems(
    { limit, skip, tags, difficulty },
    res,
    formatUtils.formatProblemsData,
    gqlQueries.problemListQuery
  );
};


export const languageStats = (_req: Request, res: Response) => {
  const username = _req.query.username as string;
  if (username) {
    controllers.fetchDataRawFormat(
      { username },
      res,
      gqlQueries.languageStatsQuery
    );
  }
  else {
    res.status(400).json({
      error: 'Missing or invalid query parameter: username',
      solution: 'put query after discussion',
      example: 'localhost:3000/languageStats?username=uwi',
    });
  }
 
};