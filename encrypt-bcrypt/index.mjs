import bcryptjs from 'bcryptjs';
import axios from 'axios';

const hash = async (value) => {
    return await bcryptjs.hash(value, 10);
}

const sendResponse = async (uriToSend, response) => {
    return await axios.post(uriToSend, response, { headers: { "Content-Type": "application/json" } })
        .then((response) => response)
        .catch((err) => { throw err; });
}

export const handler = async (event, context) => {
    try {
        const { value, course_uri } = event;
        const hashedValue = await hash(value);

        const responseObj = {
            banner: "B00972715",
            result: hashedValue,
            arn: context.invokedFunctionArn,
            action: "bcrypt",
            value: value
        }

        const axiosResponse = await sendResponse(course_uri, responseObj);
        if (axiosResponse.status === 200) {
            return responseObj;
        }
        else {
            return {
                statusCode: axiosResponse?.response?.status,
                error: `${axiosResponse.code}`
            };
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return { statusCode: err?.response?.status, error: `${err.code}` }
        }
        return { statusCode: 500, error: `${err.message}` };
    }
}