import { NextApiRequest, NextApiResponse } from 'next';

import errors from '@utils/errors';
import { connectToDatabase } from '@utils/mongodb';

export const getUsers = async () => {
    const { db } = await connectToDatabase();

    const users = await db.collection('users').find().toArray();

    return users.map((user) => ({
        ...user,
        _id: user._id?.toString(),
        createdAt: user.createdAt ? new Date(user.createdAt).toString() : null,
        updatedAt: user.updatedAt ? new Date(user.updatedAt).toString() : null,
    }));
};

/**
 * Retrieve the user list
 * */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const users = await getUsers();

        return res.json({ users });
    } catch (error) {
        res.statusCode = 500;

        return res.json({ ...errors.USER_LIST_ERROR });
    }
};

export default handler;
