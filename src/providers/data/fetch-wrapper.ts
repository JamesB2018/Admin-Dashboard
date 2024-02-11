//Creating a custom fetch. Helpful to grab GraphLAPI and improving code reusability so we can define specifics on every single fetch that we make.
// We want to add authorization headers in our custom fetch below
import { GraphQLFormattedError} from "graphql";

//Create our own custom error type below
type Error = {
    message: string;
    statusCode: string;
}

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access_token'); //Get access token from local Storage

    //Get headers from access object
    const headers = options.headers as Record<string, string>; //Creating the type String here

    //Return fetch request with added auth headers
    return await fetch(url, {
        ...options, //pass additional options
        headers: {
            ...headers, //Spread all the headers we pass
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,  //Add additional Auth header. We are getting it from the headers which is from headers?.Authorization
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true", //Apollo is a graphQL that we use in the front end to make requests to the API. We set it to a string of true

        }
    })
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): //Put in the params we need 
Error | null => {  //Now we define what the function will output. It will either be an Error or null. We can check if there is no body and in that case return an object equal to a message
   if (!body) {
    return {
        message: 'Unknown error',
        statusCode: "INTERNAL_SERVER_ERROR"
    }
   }
   
   if ("errors" in body) {
    const errors = body?.errors;
    //Join errors in a single string
    const messages = errors?.map((error) => error?.message)?.join("");  //We get one of the errors and turns all of the error messages into one
    const code = errors?.[0]?.extensions?.code; //Get the error codes

    return { //Return an object of either messages or 
        message: messages || JSON.stringify(errors),
        statusCode: code || 500 //Get status code or unless we don't know what the code is return 500 

    }
   }

   return null; //If we have the body or don't return any errors then we can just return null
} 

 export const fetchWrapper = async (url: string, options: RequestInit) => { //Options of a type Init
    const response = await customFetch(url, options); //Make the custom request with the type response
    
    //Have a clone of the response. It is useful because when we have the body for the response, by calling the response JSON, you can't read it again because it is consumed
    const responseClone = response.clone();
    const body = await responseClone.json();

    const error = getGraphQLErrors(body);

    if(error) {
        throw error;
    }

    return response;

}