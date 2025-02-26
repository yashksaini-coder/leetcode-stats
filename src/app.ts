import express, { NextFunction, Response } from 'express';
import cors from 'cors';
import * as leetcode from '../src/leetcode';
import { FetchUserDataRequest } from './types';
import apicache from 'apicache';
import axios from 'axios';
import {
  userContestRankingInfoQuery,
  userProfileUserQuestionProgressV2Query,
  skillStatsQuery,
  getUserProfileQuery,
  userProfileCalendarQuery,
  officialSolutionQuery,
  dailyQeustion,
} from '../GQL_Queries/newQueries';

const app = express();
let cache = apicache.middleware;
const API_URL = process.env.LEETCODE_API_URL || 'https://leetcode.com/graphql';

app.use(cache('5 minutes'));
app.use(cors()); //enable all CORS request

app.use((req: express.Request, _res: Response, next: NextFunction) => {
  console.log('Requested URL:', req.originalUrl);
  next();
});

async function queryLeetCodeAPI(query: string, variables: any) {
  try {
    const response = await axios.post(API_URL, { query, variables });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error from LeetCode API: ${error.response.data}`);
    } else if (error.request) {
      throw new Error('No response received from LeetCode API');
    } else {
      throw new Error(`Error in setting up the request: ${error.message}`);
    }
  }
}

app.get('/', (_req, res) => {
  res.json({
    logo: [
    "██╗     ███████╗███████╗████████╗ ██████╗ ██████╗ ██████╗ ███████╗        ███████╗████████╗ █████╗ ████████╗███████╗",
    "██║     ██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔════╝        ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝",
    "██║     █████╗  █████╗     ██║   ██║     ██║   ██║██║  ██║█████╗          ███████╗   ██║   ███████║   ██║   ███████╗",
    "██║     ██╔══╝  ██╔══╝     ██║   ██║     ██║   ██║██║  ██║██╔══╝          ╚════██║   ██║   ██╔══██║   ██║   ╚════██║",
    "███████╗███████╗███████╗   ██║   ╚██████╗╚██████╔╝██████╔╝███████╗        ███████║   ██║   ██║  ██║   ██║   ███████║",
    "╚══════╝╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝        ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝"],
    message: 'Welcome to LeetCode API',
    availableEndpoints: [
      '/:username',
      '/dailyQuestion',
      '/skillStats/:username',
      '/userProfile/:username',
      '/userProfileCalendar',
      '/userProfileUserQuestionProgressV2/:userSlug',
      '/userContestRankingInfo/:username',
      '/officialSolution',
      '/allData/:username'
    ],
  });
});

app.get('/officialSolution', async (req, res) => {
  const { titleSlug } = req.query;

  if (!titleSlug) {
    return res.status(400).json({ error: 'Missing titleSlug query parameter' });
  }
  try {
    const data = await queryLeetCodeAPI(officialSolutionQuery, { titleSlug });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/userProfileCalendar', async (req, res) => {
  const { username, year } = req.query;

  if (!username || !year || typeof year !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing or invalid username or year query parameter' });
  }

  try {
    const data = await queryLeetCodeAPI(userProfileCalendarQuery, {
      username,
      year: parseInt(year),
    });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Format data
const formatData = (data: any) => {
  return {
    totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
    totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum,
    totalQuestions: data.allQuestionsCount[0].count,
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    totalEasy: data.allQuestionsCount[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    totalMedium: data.allQuestionsCount[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    totalHard: data.allQuestionsCount[3].count,
    ranking: data.matchedUser.profile.ranking,
    contributionPoint: data.matchedUser.contributions.points,
    reputation: data.matchedUser.profile.reputation,
    submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
    recentSubmissions: data.recentSubmissionList,
    matchedUserStats: data.matchedUser.submitStats,
  };
};

app.get('/userProfile/:id', async (req, res) => {
  const user = req.params.id;

  try {
    const data = await queryLeetCodeAPI(getUserProfileQuery, {
      username: user,
    });
    if (data.errors) {
      res.send(data);
    } else {
      res.send(formatData(data.data));
    }
  } catch (error) {
    res.send(error);
  }
});

const handleRequest = async (res: Response, query: string, params: any) => {
  try {
    const data = await queryLeetCodeAPI(query, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
app.get('/dailyQuestion', (_, res) => {
  handleRequest(res, dailyQeustion, {});
});

app.get('/skillStats/:username', (req, res) => {
  const { username } = req.params;
  handleRequest(res, skillStatsQuery, { username });
});

app.get('/userProfileUserQuestionProgressV2/:userSlug', (req, res) => {
  const { userSlug } = req.params;
  handleRequest(res, userProfileUserQuestionProgressV2Query, { userSlug });
});

app.get('/userContestRankingInfo/:username', (req, res) => {
  const { username } = req.params;
  handleRequest(res, userContestRankingInfoQuery, { username });
});

//get the daily leetCode problem
app.get('/daily', leetcode.dailyProblem);

//get the selected question
app.get('/select', leetcode.selectProblem);

//get list of problems
app.get('/problems', leetcode.problems);

//get language stats
app.get('/languageStats', leetcode.languageStats);

// Construct options object on all user routes.
app.use(
  '/:username*',
  (req: FetchUserDataRequest, _res: Response, next: NextFunction) => {
    req.body = {
      username: req.params.username,
      limit: req.query.limit,
    };
    next();
  }
);

//get user profile details
app.get('/:username', leetcode.userData);
app.get('/:username/badges', leetcode.userBadges);
app.get('/:username/solved', leetcode.solvedProblem);
app.get('/:username/contest', leetcode.userContest);
app.get('/:username/contest/history', leetcode.userContestHistory);
app.get('/:username/submission', leetcode.submission);
app.get('/:username/acSubmission', leetcode.acSubmission);
app.get('/:username/calendar', leetcode.calendar);

//get all user data
app.get('/allData/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const userProfileData = await queryLeetCodeAPI(getUserProfileQuery, { username });
    const skillStatsData = await queryLeetCodeAPI(skillStatsQuery, { username });
    const userContestRankingInfoData = await queryLeetCodeAPI(userContestRankingInfoQuery, { username });
    const userProfileCalendarData = await queryLeetCodeAPI(userProfileCalendarQuery, { username, year: new Date().getFullYear() });
    const userProfileUserQuestionProgressV2Data = await queryLeetCodeAPI(userProfileUserQuestionProgressV2Query, { userSlug: username });

    const formattedUserProfileData = formatData(userProfileData.data);

    res.json({
      userProfile: formattedUserProfileData,
      skillStats: skillStatsData.data,
      userContestRankingInfo: userContestRankingInfoData.data,
      userProfileCalendar: userProfileCalendarData.data,
      userProfileUserQuestionProgressV2: userProfileUserQuestionProgressV2Data.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default app;
