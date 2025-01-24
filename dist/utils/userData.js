"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSubmissionCalendarData = exports.formatAcSubmissionData = exports.formatSubmissionData = exports.formatSolvedProblemsData = exports.formatContestHistoryData = exports.formatContestData = exports.formatBadgesData = exports.formatUserData = void 0;
const formatUserData = (data) => ({
    username: data.matchedUser.username,
    name: data.matchedUser.profile.realName,
    birthday: data.matchedUser.profile.birthday,
    avatar: data.matchedUser.profile.userAvatar,
    ranking: data.matchedUser.profile.ranking,
    reputation: data.matchedUser.profile.reputation,
    gitHub: data.matchedUser.githubUrl,
    twitter: data.matchedUser.twitterUrl,
    linkedIN: data.matchedUser.linkedinUrl,
    website: data.matchedUser.profile.websites,
    country: data.matchedUser.profile.countryName,
    company: data.matchedUser.profile.company,
    school: data.matchedUser.profile.school,
    skillTags: data.matchedUser.profile.skillTags,
    about: data.matchedUser.profile.aboutMe,
});
exports.formatUserData = formatUserData;
const formatBadgesData = (data) => ({
    badgesCount: data.matchedUser.badges.length,
    badges: data.matchedUser.badges,
    upcomingBadges: data.matchedUser.upcomingBadges,
    activeBadge: data.matchedUser.activeBadge,
});
exports.formatBadgesData = formatBadgesData;
const formatContestData = (data) => {
    var _a, _b, _c, _d, _e, _f;
    return ({
        contestAttend: (_a = data.userContestRanking) === null || _a === void 0 ? void 0 : _a.attendedContestsCount,
        contestRating: (_b = data.userContestRanking) === null || _b === void 0 ? void 0 : _b.rating,
        contestGlobalRanking: (_c = data.userContestRanking) === null || _c === void 0 ? void 0 : _c.globalRanking,
        totalParticipants: (_d = data.userContestRanking) === null || _d === void 0 ? void 0 : _d.totalParticipants,
        contestTopPercentage: (_e = data.userContestRanking) === null || _e === void 0 ? void 0 : _e.topPercentage,
        contestBadges: (_f = data.userContestRanking) === null || _f === void 0 ? void 0 : _f.badge,
        contestParticipation: data.userContestRankingHistory.filter((obj) => obj.attended === true),
    });
};
exports.formatContestData = formatContestData;
const formatContestHistoryData = (data) => ({
    count: data.userContestRankingHistory.length,
    contestHistory: data.userContestRankingHistory,
});
exports.formatContestHistoryData = formatContestHistoryData;
const formatSolvedProblemsData = (data) => ({
    solvedProblem: data.matchedUser.submitStats.acSubmissionNum[0].count,
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    totalSubmissionNum: data.matchedUser.submitStats.totalSubmissionNum,
    acSubmissionNum: data.matchedUser.submitStats.acSubmissionNum,
});
exports.formatSolvedProblemsData = formatSolvedProblemsData;
const formatSubmissionData = (data) => ({
    count: data.recentSubmissionList.length,
    submission: data.recentSubmissionList,
});
exports.formatSubmissionData = formatSubmissionData;
const formatAcSubmissionData = (data) => ({
    count: data.recentAcSubmissionList.length,
    submission: data.recentAcSubmissionList,
});
exports.formatAcSubmissionData = formatAcSubmissionData;
const formatSubmissionCalendarData = (data) => ({
    submissionCalendar: data.matchedUser.submissionCalendar,
});
exports.formatSubmissionCalendarData = formatSubmissionCalendarData;
//# sourceMappingURL=userData.js.map