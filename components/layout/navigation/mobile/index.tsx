import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import Link from 'next/link';

import useHydrationRender from '@helpers/useHydrationRender';
import useUserContext from '@helpers/useUserContext';

import { Media } from '@components/media/Media';
import DarkModeToggle from '@components/dark-mode-toggle';

import { Button } from '@theme/styles';

import NavLink from '../desktop/nav-link/NavLink';

import Burger from './burger-icon';

import { Header, Nav, Overlay } from './styles';

const MobileNavigation: FC = () => {
    const isHydrationRender = useHydrationRender();

    const burgerRef = useRef(null);
    const sideMenuRef = useRef(null);

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const { isAuthenticated, logout } = useUserContext();

    const logoutAction = useCallback(() => {
        logout();
    }, [logout]);

    const toggleSideMenu = useCallback(() => {
        setIsSideMenuOpen(!isSideMenuOpen);
    }, [isSideMenuOpen]);

    const handleClick = useCallback((e) => {
        if (
            sideMenuRef.current?.contains(e.target) ||
            burgerRef.current?.contains(e.target)
        ) {
            return;
        }

        setIsSideMenuOpen(false);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isSideMenuOpen ? 'hidden' : 'auto';
    }, [isSideMenuOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Media at="xs">
            <Header>
                <Burger
                    ref={burgerRef}
                    isOpen={isSideMenuOpen}
                    onOpen={toggleSideMenu}
                />
                <DarkModeToggle />
            </Header>
            <Overlay isOpen={isSideMenuOpen} />
            <Nav ref={sideMenuRef} isOpen={isSideMenuOpen}>
                <ul>
                    <li>
                        <Link href={'/'}>Home</Link>
                    </li>
                    <li>
                        <Link href={'/forall'}>For All</Link>
                    </li>
                    <li>
                        <NavLink href={'/forguests'}>For Guests</NavLink>
                    </li>
                    <li>
                        <Link href={'/forusers'}>For users only</Link>
                    </li>
                    {!isHydrationRender ? (
                        <>
                            <li>
                                <Link
                                    href={
                                        isAuthenticated ? '/account' : '/signin'
                                    }
                                >
                                    {isAuthenticated ? 'Account' : 'Login'}
                                </Link>
                            </li>
                            {!isAuthenticated && (
                                <li>
                                    <Link href={'/register'}>Register</Link>
                                </li>
                            )}
                        </>
                    ) : null}
                </ul>
                <div>
                    {isHydrationRender && isAuthenticated && (
                        <Button onClick={logoutAction}>Logout</Button>
                    )}
                </div>
            </Nav>
        </Media>
    );
};

export default MobileNavigation;
