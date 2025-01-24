"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchSingleProblem = async (res, formatData, query, titleSlug) => {
    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Referer: 'https://leetcode.com',
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    titleSlug,
                },
            }),
        });
        const result = await response.json();
        if (result.errors) {
            return res.send(result);
        }
        return res.json(formatData(result.data));
    }
    catch (err) {
        console.error('Error: ', err);
        return res.send(err);
    }
};
exports.default = fetchSingleProblem;
//# sourceMappingURL=fetchSingleProblem.js.map