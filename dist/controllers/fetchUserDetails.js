"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchUserDetails = async (options, res, formatData, query) => {
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
                    username: options.username,
                    limit: options.limit,
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
exports.default = fetchUserDetails;
//# sourceMappingURL=fetchUserDetails.js.map