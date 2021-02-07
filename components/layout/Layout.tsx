import React, { FC } from 'react';

import { MediaContextProvider } from '@components/media/Media';
import DocumentHead from '@components/layout/document-head';
import MobileNavigation from '@components/layout/navigation/mobile';
import DesktopNavigation from '@components/layout/navigation/desktop';
import Footer from '@components/layout/footer';

type Props = {
    children: any;
};

const Layout: FC<Props> = ({ children }: Props) => {
    return (
        <main>
            <DocumentHead />
            <MediaContextProvider>
                <DesktopNavigation />
                <MobileNavigation />
            </MediaContextProvider>
            {children}
            <Footer />
        </main>
    );
};

export default Layout;
