import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';
import { getSession } from 'next-auth/client';

import errors from '@utils/errors';
import { connectToDatabase } from '@utils/mongodb';

export const getAllPosts = async () => {
    const { db } = await connectToDatabase();

    return await db
        .collection('posts')
        .aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'users',
                },
            },
        ])
        .toArray();
};

export const getUserByEmail = async (email) => {
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ email });

    return {
        ...user,
        //_id: user._id?.toString(),
        createdAt: user.createdAt ? new Date(user.createdAt).toString() : null,
        updatedAt: user.updatedAt ? new Date(user.updatedAt).toString() : null,
    };
};

export const insertPost = async (userId) => {
    const { db } = await connectToDatabase();

    return await db.collection('posts').insertOne({
        title: 'title',
        body: 'body',
        postedBy: new ObjectID(userId),
    });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body;

    try {
        if (req.method === 'POST') {
            //const session = await getSession({ req });

            //if (session) {
            // Signed in
            //console.log('Session', JSON.stringify(session, null, 2));

            // get user id
            const user = await getUserByEmail(email);

            // save post information also adding user
            await insertPost(user._id);

            return res.status(201).end();
            // } else {
            //     // Not Signed in
            //     return res.status(401).end();
            // }
        }

        if (req.method === 'GET') {
            const posts = await getAllPosts();

            return res.json({ posts });
        }
    } catch (error) {
        console.log('### error ', error);
        res.statusCode = 500;

        return res.json({ ...errors.SAVE_POST_ERROR });
    }
};

export default handler;
