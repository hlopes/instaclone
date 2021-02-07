import React from 'react';
import { NextPage } from 'next';

import withGuest from '@helpers/withGuest';
import Layout from '@components/layout/Layout';

import { Section } from '@theme/styles';

const ForGuests: NextPage = () => (
    <Layout>
        <Section>
            <p>For Guests only.</p>
        </Section>
    </Layout>
);

export default withGuest(ForGuests);
