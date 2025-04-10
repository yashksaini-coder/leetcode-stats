"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const leetcode = __importStar(require("../src/leetcode"));
const apicache_1 = __importDefault(require("apicache"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const newQueries_1 = require("../GQL_Queries/newQueries");
const app = (0, express_1.default)();
let cache = apicache_1.default.middleware;
const API_URL = process.env.LEETCODE_API_URL || 'https://leetcode.com/graphql';
app.use(cache('5 minutes'));
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../template')));
app.use((req, _res, next) => {
    console.log('Requested URL:', req.originalUrl);
    next();
});
async function queryLeetCodeAPI(query, variables) {
    try {
        const response = await axios_1.default.post(API_URL, { query, variables });
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data;
    }
    catch (error) {
        if (error.response) {
            throw new Error(`Error from LeetCode API: ${error.response.data}`);
        }
        else if (error.request) {
            throw new Error('No response received from LeetCode API');
        }
        else {
            throw new Error(`Error in setting up the request: ${error.message}`);
        }
    }
}
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../template/base.html'));
});
app.get('/officialSolution', async (req, res) => {
    const { titleSlug } = req.query;
    if (!titleSlug) {
        return res.status(400).json({ error: 'Missing titleSlug query parameter' });
    }
    try {
        const data = await queryLeetCodeAPI(newQueries_1.officialSolutionQuery, { titleSlug });
        return res.json(data);
    }
    catch (error) {
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
        const data = await queryLeetCodeAPI(newQueries_1.userProfileCalendarQuery, {
            username,
            year: parseInt(year),
        });
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
const formatData = (data) => {
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
        const data = await queryLeetCodeAPI(newQueries_1.getUserProfileQuery, {
            username: user,
        });
        if (data.errors) {
            res.send(data);
        }
        else {
            res.send(formatData(data.data));
        }
    }
    catch (error) {
        res.send(error);
    }
});
const handleRequest = async (res, query, params) => {
    try {
        const data = await queryLeetCodeAPI(query, params);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
app.get('/dailyQuestion', (_, res) => {
    handleRequest(res, newQueries_1.dailyQeustion, {});
});
app.get('/skillStats/:username', (req, res) => {
    const { username } = req.params;
    handleRequest(res, newQueries_1.skillStatsQuery, { username });
});
app.get('/userProfileUserQuestionProgressV2/:userSlug', (req, res) => {
    const { userSlug } = req.params;
    handleRequest(res, newQueries_1.userProfileUserQuestionProgressV2Query, { userSlug });
});
app.get('/userContestRankingInfo/:username', (req, res) => {
    const { username } = req.params;
    handleRequest(res, newQueries_1.userContestRankingInfoQuery, { username });
});
app.get('/daily', leetcode.dailyProblem);
app.get('/select', leetcode.selectProblem);
app.get('/problems', leetcode.problems);
app.get('/languageStats', leetcode.languageStats);
app.use('/:username*', (req, _res, next) => {
    req.body = {
        username: req.params.username,
        limit: req.query.limit,
    };
    next();
});
app.get('/:username', leetcode.userData);
app.get('/:username/badges', leetcode.userBadges);
app.get('/:username/solved', leetcode.solvedProblem);
app.get('/:username/contest', leetcode.userContest);
app.get('/:username/contest/history', leetcode.userContestHistory);
app.get('/:username/submission', leetcode.submission);
app.get('/:username/acSubmission', leetcode.acSubmission);
app.get('/:username/calendar', leetcode.calendar);
app.get('/allData/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const userProfileData = await queryLeetCodeAPI(newQueries_1.getUserProfileQuery, { username });
        const skillStatsData = await queryLeetCodeAPI(newQueries_1.skillStatsQuery, { username });
        const userContestRankingInfoData = await queryLeetCodeAPI(newQueries_1.userContestRankingInfoQuery, { username });
        const userProfileCalendarData = await queryLeetCodeAPI(newQueries_1.userProfileCalendarQuery, { username, year: new Date().getFullYear() });
        const userProfileUserQuestionProgressV2Data = await queryLeetCodeAPI(newQueries_1.userProfileUserQuestionProgressV2Query, { userSlug: username });
        const formattedUserProfileData = formatData(userProfileData.data);
        res.json({
            userProfile: formattedUserProfileData,
            skillStats: skillStatsData.data,
            userContestRankingInfo: userContestRankingInfoData.data,
            userProfileCalendar: userProfileCalendarData.data,
            userProfileUserQuestionProgressV2: userProfileUserQuestionProgressV2Data.data,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map