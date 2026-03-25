import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { register, login, logout, getMe } from "../services/auth.api.js";
// custom hook for authentication

export const useAuth=()=>{
    const context= useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    // login function for handling user login
    const haldleLoading= async({email,password})=>{
        setLoading(true); // loading true kr diya jab login ya register call hoga
        try{
            const data= await login(email,password);
        setUser(data.user);

        }
        catch(error){
            console.error("Login error:", error);
        }finally{
            setLoading(false); // loading false kr diya jab login ya register call complete ho jayega
        }
        
    }

    // register function for handling user registration
    const handleRegister= async({username,email,password})=>{
        setLoading(true); // jan tk api k response na aa jaye tb tk loading hogi
        try{
            const data= await register(username,email,password);
            setUser(data.user);

        }catch(error){
            console.error("Registration error:", error);
        }finally{
        
        setLoading(false);
        }
    }

    const handleLogout= async()=>{
        setLoading(true);
        try{
            const data=await logout();
        setUser(null); // user ko null kr diya logout hone ke baad

        }catch(error){
            console.error("Logout error:", error);
        }finally{
        
        setLoading(false);
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    },[]);

    return {
        user,
        loading,
        haldleLoading,
        handleRegister,
        handleLogout
    }
}