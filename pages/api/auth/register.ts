import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { connectToDatabase } from '@utils/mongodb';
import errors from '@utils/errors';

import { User } from '../../../types/User';

/**
 * Internal register without using the next/auth mechanism
 * */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, email, password } = JSON.parse(req.body);

    if (!name || !email || !password) {
        res.statusCode = 422;

        return res.json({ ...errors.REGISTER_FORM_DATA_MISSING });
    }

    try {
        const { db } = await connectToDatabase();

        const savedUser: User = await db.collection('users').findOne({ email });

        if (!process.env.JWT_SECRET) {
            res.statusCode = 422;

            return res.json({ ...errors.SECRET_NOT_DEFINED });
        }

        if (savedUser) {
            res.statusCode = 422;

            return res.json({ ...errors.ALREADY_REGISTERED });
        }

        const hashed = await bcrypt.hash(password, 12);

        if (hashed) {
            const user = {
                email,
                name,
                password: hashed,
            };

            await db.collection('users').insertOne(user);

            const token = jwt.sign({ _id: user.email }, process.env.JWT_SECRET);

            res.status(201);

            return res.json({
                message: 'Saved successfully',
                user,
                token,
            });
        }
    } catch (error) {
        res.statusCode = 500;

        return res.json({ ...errors.ERROR_REGISTERING });
    }
};

export default handler;
