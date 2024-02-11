//Creating a custom fetch. Helpful to grab GraphLAPI and improving code reusability so we can define specifics on every single fetch that we make.
// We want to add authorization headers in our custom fetch below

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access_token'); //Get access token from local Storage

    //Get headers from access object
    const headers = options.headers as Record<string, string>; //Creating the type String here

    //Return fetch request with auth headers
    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`  //Add additional Auth header. We are getting it from the headers which is from headers?.Authorization
        }
    })
}