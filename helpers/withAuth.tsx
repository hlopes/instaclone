import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import useUserContext from './useUserContext';

export default function withAuth(Component) {
    return function WithAuthComponent(props) {
        const router = useRouter();
        const { result } = useUserContext();

        useEffect(() => {
            if (!result?.user?.email) {
                router.push('/signin');
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [result]);

        return !result?.user?.email ? (
            <noscript>
                <p>JS is disabled?</p>
            </noscript>
        ) : (
            <Component {...props} />
        );
    };
}
