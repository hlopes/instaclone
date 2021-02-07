import React from 'react';
import { compose } from 'recompose';
import { NextPage } from 'next';

import withAuth from '@helpers/withAuth';
import useUserContext from '@helpers/useUserContext';

import Layout from '@components/layout/Layout';

import { Section } from '@theme/styles';

const Account: NextPage = () => {
    const { result } = useUserContext();

    return (
        <Layout>
            <Section>
                <div>
                    {result?.user?.image && <img src={result?.user?.image} />}
                </div>
                <div>{result?.user.name}</div>
                <div>{result?.user.email}</div>
            </Section>
        </Layout>
    );
};

const enhanced = compose(withAuth);

export default enhanced(Account);
