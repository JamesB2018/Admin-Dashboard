import graphqlDataProvider, {
     GraphQLClient,
     liveProvider as graphqlLiveProvider
    } from "@refinedev/nestjs-query";
import {createClient } from 'graphql-ws'
import { fetchWrapper } from "./fetch-wrapper";

export const API_BASE_URL = 'https://api.crm.refine.dev'
export const API_URL = `${API_BASE_URL}/graphql`
export const WS_URL = 'wss://api.crm.refine.dev/graphql'

export const client = new GraphQLClient(API_URL, {
    fetch: (url:string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options); //Pass the url as well as the options
        } catch (error) {
            return Promise.reject(error as Error)
        }
    }
})

//Web Socket client. Built in provider Live Provider. lets app update in real time. 
export const wsClient = typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
            const accessToken = localStorage.getItem("access_token");

            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        }

    })
    : undefined //In case we are not within the browser, we make it undefined

//Creating a data provider variable for requests to the GraphQL API
export const dataProvider = graphqlDataProvider(client) //Function that takes a graphql client and data provider for Refien to use

//Creating a live provider for subscriptions
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined //if wsClient exists then call live Provider otherwise it's undefined
