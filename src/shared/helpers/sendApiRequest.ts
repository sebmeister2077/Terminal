type Response = {
    route: string;
    response: string;
};

export const sendApiRequest = async (command: string): Promise<Response> => {
    // const response = await fetch(`/api?command=${command}`);
    // const responseData: Response = await response.json();
    // return responseData;
    return {
        route: `D:/Sebas/${command}>`,
        response: `
            This is line 1,
            this is line 2
        `,
    };
};
