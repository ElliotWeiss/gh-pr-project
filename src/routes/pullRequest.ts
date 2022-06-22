import express, { Router } from 'express';
import { getPullReqestInfo } from '../handlers/pullRequest';

const router: Router = express.Router();

router.get("/", getPullReqestInfo);

export = router;