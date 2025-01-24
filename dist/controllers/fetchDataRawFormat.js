"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchDataRawFormat = async (options, res, query) => {
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
                },
            }),
        });
        const result = await response.json();
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }
        if (result.errors) {
            return res.send(result);
        }
        return res.json(result.data);
    }
    catch (err) {
        console.error('Error: ', err);
        return res.send(err);
    }
};
exports.default = fetchDataRawFormat;
//# sourceMappingURL=fetchDataRawFormat.js.map