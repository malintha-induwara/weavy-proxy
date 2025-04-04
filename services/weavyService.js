import axios from 'axios';
import 'dotenv/config'; 

const weavyUrl = process.env.WEAVY_URL;
const weavyApiKey = process.env.WEAVY_API_KEY;

if (!weavyUrl || !weavyApiKey) {
    console.error(".env file is empty.");
    process.exit(1);
}


const callWeavyApi = async (method, path, data = null, params = null, authorizationToken = null) => {
    const url = `${weavyUrl}${path}`;
    const tokenToUse = authorizationToken || `Bearer ${weavyApiKey}`; 

    console.log(`Calling Weavy API: ${method} ${url}`); 

    try {
        const response = await axios({
            method: method,
            url: url,
            data: data,
            params: params,
            headers: {
                'Authorization': tokenToUse,
                'Content-Type': 'application/json',
            },
        
            validateStatus: function (status) {
                return status >= 200 && status < 500; 
            }
        });

        console.log(`Weavy API Response Status: ${response.status}`); 

        return {
            status: response.status,
            data: response.data
        };

    } catch (error) {
        console.error(`Error calling Weavy API (${method} ${url}):`, error.message);
        if (error.response) {

             return { status: error.response.status, data: error.response.data };
        } else if (error.request) {
            
             return { status: 503, data: { message: "Service Unavailable: No response from Weavy API." } };
        } else {
            
             return { status: 500, data: { message: `Internal Server Error: ${error.message}` } };
        }
    }
};

//User API 


// POST /api/users
export const createUser = async (userData) => {
    return callWeavyApi('POST', '/api/users', userData);
};

// GET /api/users/{user}
export const getUser = async (userId, trashed = false) => {
    const params = trashed ? { trashed: true } : {};
    return callWeavyApi('GET', `/api/users/${userId}`, null, params);
};

// PATCH /api/users/{user}
export const updateUser = async (userId, updateData) => {
    return callWeavyApi('PATCH', `/api/users/${userId}`, updateData);
};

// PUT /api/users/{uid}
export const upsertUser = async (uid, userData) => {
    const bodyData = { ...userData, uid: uid };
    return callWeavyApi('PUT', `/api/users/${uid}`, bodyData);
};

//POST /api/users/{user}/trash
export const trashUser = async (userId) => {
    return callWeavyApi('POST', `/api/users/${userId}/trash`);
};

// GET /api/users
export const listUsers = async (queryParams, authorizationToken = null) => {
    return callWeavyApi('GET', '/api/users', null, queryParams, authorizationToken);
};


