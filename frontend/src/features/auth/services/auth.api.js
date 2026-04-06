// frontend backend se kese interact krne wala h uska code yaha likhenge
// jo backend p 4 API create ki h(register,login,logout,get-me) unko call krne wala code yaha likhenge

import axios from "axios";

// axios instance create krne wala code. itna code repeat ho rha tha
// ab ham api.get api.post use krke API call kr skte h without writing baseURL and withCredentials every time
const api= axios.create({
    baseURL: 'https://resume-analyzer-wgah.onrender.com',
    withCredentials: true
})

//register API call krne wala function
export async function register(username,email,password){
    try{
    const response = await api.post('/api/auth/register', {
        username, email, password }
        );

    return response.data;

} catch (error) {
    console.log('Error registering user:', error);
    throw error;
}
}

//login API call krne wala function
export async function login(email,password){
    try{
    const response = await api.post('/api/auth/login', {
        email, password });

    return response.data;

} catch (error) {
    console.log('Error logging in user:', error);
    throw error;
}
}

//logout API call krne wala function
export async function logout(){
    try{
    const response = await api.get('/api/auth/logout'
        );
    return response.data;
} catch (error) {
    console.log('Error logging out user:', error);
    throw error;
}
}

//get-me API call krne wala function
export async function getMe(){
    try{
    const response = await api.get('/api/auth/get-me');

    return response.data;
} catch (error) {
    console.log('Error fetching user data:', error);
    throw error;
}   
}