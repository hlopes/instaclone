import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import errors from '@utils/errors';
import { connectToDatabase } from '@utils/mongodb';

import { User } from '../../../types/User';

/**
 * Internal login without using the next/auth mechanism
 * */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = JSON.parse(req.body);

    if (!email || !password) {
        res.statusCode = 422;

        return res.json({ ...errors.LOGIN_FORM_DATA_MISSING });
    }

    try {
        const { db } = await connectToDatabase();

        const savedUser: User = await db.collection('users').findOne({ email });

        if (!savedUser) {
            res.statusCode = 422;

            return res.json({ ...errors.USER_NOT_FOUND });
        }

        if (!process.env.JWT_SECRET) {
            res.statusCode = 422;

            return res.json({ ...errors.SECRET_NOT_DEFINED });
        }

        const doMatch: boolean = await bcrypt.compare(
            password,
            savedUser.password
        );

        if (doMatch) {
            const token = jwt.sign(
                { _id: savedUser.email },
                process.env.JWT_SECRET
            );

            // remove password
            const { _id, name, email } = savedUser;

            return res.json({
                token,
                user: { _id, name, email },
            });
        }

        res.statusCode = 422;

        return res.json({ ...errors.USER_NOT_FOUND });
    } catch (error) {
        console.log('Error ', error);
    }
};

export default handler;
