"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query = `#graphql
query getRecentSubmissions($username: String!, $limit: Int) {
    recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
    }
}`;
exports.default = query;
//# sourceMappingURL=recentSubmit.js.map