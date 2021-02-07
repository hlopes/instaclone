import React, { FC } from 'react';
import Link from 'next/link';

import useUserContext from '@helpers/useUserContext';
import useHydrationRender from '@helpers/useHydrationRender';

import { Media } from '@components/media/Media';
import Button from '@components/button';

import Burger from '@components/layout/navigation/mobile/burger-icon';
import DarkModeToggle from '@components/dark-mode-toggle';
import { Header } from '@components/layout/navigation/mobile/styles';

import { Nav, ButtonWrapper } from './styles';

import NavLink from './nav-link/NavLink';

const DesktopNavigation: FC = () => {
    const isHydrationRender = useHydrationRender();
    const { isAuthenticated, logout } = useUserContext();

    return (
        <Media greaterThan="xs">
            <Nav>
                <div>
                    <NavLink href={'/'}>Home</NavLink>
                    <NavLink href={'/forall'}>For All</NavLink>
                    <NavLink href={'/forguests'}>For Guests</NavLink>
                    <NavLink href={'/forusers'}>For Users</NavLink>
                </div>
                {!isHydrationRender ? (
                    <ButtonWrapper>
                        <Link href={isAuthenticated ? '/account' : '/signin'}>
                            <Button>
                                {isAuthenticated ? 'Account' : 'Login'}
                            </Button>
                        </Link>
                        {!isAuthenticated && (
                            <Link href={'/register'}>
                                <Button>Register</Button>
                            </Link>
                        )}
                        {isAuthenticated && (
                            <Button onClick={logout}>Logout</Button>
                        )}
                    </ButtonWrapper>
                ) : null}
                <DarkModeToggle />
            </Nav>
        </Media>
    );
};

export default DesktopNavigation;
