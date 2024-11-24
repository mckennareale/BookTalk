const customFetch = async (url, options = {}, navigate) => {
    const token = localStorage.getItem('authToken');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization' : `Bearer ${token}`})
    }

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        }
    }

    try {
        const res = await fetch(url, mergedOptions);

        if (res.status === 401) {
            localStorage.removeItem('authToken');
            if (navigate) {
                navigate('/login', { replace: true });
            }
        }

        if (!res.ok) {
            
            const errData = await res.json();
            throw new Error(errData.message || 'Something went wrong');
        }

        const returnData = await res.json();
        console.log(returnData);
        return returnData;

    } catch (error) {
        console.error('Fetch error: ', error.message);
        throw error;
    }

}

export { customFetch };