import express, { Application } from 'express';
import axios, { AxiosResponse } from 'axios';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const SERVER_PORT: string = '8080';
const RESUTLTS_PER_PAGE: string = '100';

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

interface PullRequest {
    id: number
    number: number
    title: string
    author: string
    commitsUrl: string
}
app.get("/pr", async (req, res, next) => {
    const owner: string = req.query.owner as string;
    const repo: string = req.query.repo as string;

    try {
        const results: AxiosResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?per_page=${RESUTLTS_PER_PAGE}`);
        const resultsArr: PullRequest[] = [];
        for (let element of results.data) {
            const pr: PullRequest = {
                id: element.id,
                number: element.number,
                title: element.title,
                author: element.user.login,
                commitsUrl: element.commits_url
            };
            //console.log(pr.id, pr.number, pr.title, pr.author, pr.commitsUrl);
            resultsArr.push(pr);
        }
        res.status(200).json(resultsArr);
        console.log("Successfully retrieved pull request information");
    }
    catch (error) {
        res.status(404).json({
            "Message": error
        });
        console.error(error);
    }
});

app.listen(SERVER_PORT, () => console.log(`App listening on port ${SERVER_PORT}...`));