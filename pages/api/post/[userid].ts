import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';

import errors from '@utils/errors';
import { connectToDatabase } from '@utils/mongodb';

export const getPostsByUser = async (userid) => {
    const { db } = await connectToDatabase();

    return await db
        .collection('posts')
        .find({ postedBy: ObjectID(userid) })
        .toArray();
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userid } = req.query;

    try {
        if (req.method === 'GET') {
            const posts = await getPostsByUser(userid);

            return res.json({ posts });
        }
    } catch (error) {
        res.statusCode = 500;

        return res.json({ ...errors.GET_USER_POSTS_ERROR });
    }
};

export default handler;
