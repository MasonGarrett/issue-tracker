'use client';

import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

// Used for checking user status
const AuthProvider = ({ children }: PropsWithChildren) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
