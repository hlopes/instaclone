import React, { useCallback } from 'react';

import { NextPage } from 'next';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';

import Layout from '@components/layout/Layout';
import SigninForm from '@components/signin-form';

import { Section, Button } from '@theme/styles';
import { h2 } from '@theme/typography';

const SignIn: NextPage = () => {
    const [session, isLoading] = useSession();

    const handleAuthLogin = useCallback(() => signIn(), []);
    const handleAuthLogout = useCallback(
        () =>
            signOut({
                callbackUrl: '/',
            }),
        []
    );

    return (
        <Layout>
            <Section>
                <h2>Simple Authentication</h2>
                <SigninForm />
                <p>
                    New player? <Link href={'/register'}>Register</Link>
                </p>
            </Section>
            <Section>
                <h2>Next Authentication</h2>
                {isLoading && <p>loading...</p>}
                {!session && (
                    <>
                        <p>Not signed in</p>
                        <Button onClick={handleAuthLogin}>Sign in</Button>
                    </>
                )}
                {session && (
                    <>
                        <p>Signed in as {session.user.email}</p>
                        <Button onClick={handleAuthLogout}>Sign out</Button>
                    </>
                )}
            </Section>
        </Layout>
    );
};

export default SignIn;
