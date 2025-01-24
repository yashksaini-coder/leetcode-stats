"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query = `#graphql
query getACSubmissions ($username: String!, $limit: Int) {
    recentAcSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
    }
}`;
exports.default = query;
//# sourceMappingURL=recentAcSubmit.js.map