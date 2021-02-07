import React from 'react';
import { NextPage } from 'next';

import withAuth from '@helpers/withAuth';
import Layout from '@components/layout/Layout';

import { Section } from '@theme/styles';

const ForUsers: NextPage = () => (
    <Layout>
        <Section>
            <p>For Users only.</p>
        </Section>
    </Layout>
);

export default withAuth(ForUsers);
