"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query = `
    query languageStats($username: String!) {
        matchedUser(username: $username) {
            languageProblemCount {
                languageName
                problemsSolved
            }
        }
    }
`;
exports.default = query;
//# sourceMappingURL=languageStats.js.map