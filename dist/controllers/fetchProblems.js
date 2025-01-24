"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchProblems = async (options, res, formatData, query) => {
    try {
        const limit = options.skip !== undefined && options.limit === undefined ? 1 : options.limit || 20;
        const skip = options.skip || 0;
        const tags = options.tags ? options.tags.split(' ') : [];
        const difficulty = options.difficulty || undefined;
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Referer: 'https://leetcode.com',
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    categorySlug: '',
                    skip,
                    limit,
                    filters: { tags,
                        difficulty
                    },
                },
            }),
        });
        console.log(response);
        const result = await response.json();
        if (result.errors) {
            return res.status(400).json(result.errors);
        }
        return res.json(formatData(result.data));
    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.default = fetchProblems;
//# sourceMappingURL=fetchProblems.js.map