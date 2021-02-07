import React from 'react';
import { NextPage } from 'next';

import Layout from '@components/layout/Layout';

import { Section } from '@theme/styles';
import { h2 } from '@theme/typography';

import { User } from '../types/User';

import { getUsers } from './api/users';

export const getStaticProps = async () => {
    const users = await getUsers();

    return {
        props: {
            users,
        },
    };
};

type HomeProps = {
    users: User[];
};

const Home: NextPage<HomeProps> = ({ users }: HomeProps) => {
    return (
        <Layout>
            <Section>
                <h2>Home</h2>
                <p>This is the homepage.</p>

                <h3>Users</h3>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>{user.name}</li>
                    ))}
                </ul>
            </Section>
        </Layout>
    );
};

export default Home;
