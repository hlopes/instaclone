import React from 'react';
import { useRouter } from 'next/router';

import useUserContext from './useUserContext';

export default function withGuest(Component) {
    return function WithGuestComponent(props) {
        const router = useRouter();

        const { result } = useUserContext();

        if (result?.user?.email) {
            router.push('/');
        }

        return result?.user?.email ? null : <Component {...props} />;
    };
}
