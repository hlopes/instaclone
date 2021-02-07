export const login = async (email: string, password: string) => {
    if (!email || !password) {
        // TODO: What should be done without required arguments
        return null;
    }

    const result = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
    });

    return result.json();
};

export const register = async (
    name: string,
    email: string,
    password: string
) => {
    if (!name || !email || !password) {
        // TODO: What should be done without required arguments
        return null;
    }

    const result = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

    return await result.json();
};
