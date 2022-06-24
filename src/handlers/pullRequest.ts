import { Request, Response, NextFunction } from 'express';
import axios, { Axios, AxiosResponse } from 'axios';
import { PullRequest } from '../models/pullRequest';

const RESULTS_PER_PAGE: string = '5';

export const getPullReqestInfo = async (req: Request, res: Response, _next: NextFunction) => {
    const owner: string = req.query.owner as string;
    const repo: string = req.query.repo as string;

    try {
        const results: AxiosResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?per_page=${RESULTS_PER_PAGE}`);
        
        const resultsArr: PullRequest[] = [];
        const commitsArr: Promise<number>[] = [];
        
        for (const element of results.data) {
            const pr: PullRequest = {
                id: element.id,
                number: element.number,
                title: element.title,
                author: element.user.login,
                commitCount: 0 //await getCommitCount(element.commits_url)
            };
          
            commitsArr.push(getCommitCount(element.commits_url));
            resultsArr.push(pr);
        }

        // Use a Promise.all() to improve performance - the GET requests to commits_url are non-blocking
        const commitCountArr: number[] = await Promise.all(commitsArr);  
        
        // Assign the commitCount in resultsArr to the number returned in commitCountsArr since Promise.all preserve the order of the promises passed in
        commitCountArr.forEach((count, i) => resultsArr[i].commitCount = count);

        res.status(200).json(resultsArr);
        console.log("Successfully retrieved pull request information");
    }

    catch (error) {
        res.status(404).json({
            "Message": error
        });
        console.error(error);
    }
}

const getCommitCount = async (commits_url: string): Promise<number> => {

    try {
        const results: AxiosResponse = await axios.get(commits_url);
        const commitCount = Object.keys(results.data).length;

        return commitCount;
    }

    catch (error) {
        return 0;
    }

};