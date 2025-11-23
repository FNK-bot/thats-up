import { create } from "zustand";
import { api } from "../api/axios";
import type { User } from "../types";
import toast from "react-hot-toast";
import { io, Socket } from 'socket.io-client';

export interface AuthState {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isSignedUp: boolean;
  isLoggingIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  userData: User | null;
  isUpdatingProfile: boolean;
  updateProfile: (img: any) => Promise<void>;
  socket:null | Socket
  onlineUsers:string[]
  connectSocket : ()=>void;
  disconnectSocket : ()=>void;
}
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create<AuthState>((set,get) =>{
    return {
        isAuthenticated: false,
        isCheckingAuth: true,
        userData:null,
        isLoggingIn: false,
        isSignedUp: false,
        isUpdatingProfile: false,
        socket: null,
        onlineUsers:[],

        login: async (email: string, password: string) => {
            try {
                set({ isLoggingIn: true });
                const response = await api.post('/auth/login', { email, password });
                set({ isAuthenticated: true });
                set({ userData: response.data.user });
                toast.success("Login successful!");
                get().connectSocket();
                
            } catch (error) {
                console.error('Login failed:', error);
                toast.error(`${(error as any).response?.data?.message || 'Login failed. Please try again.'}`);
                set({ isAuthenticated: false });
            }finally {
                set({ isLoggingIn: false });
            }
        },

        signup: async (fullName: string, email: string, password: string) => {
            try {
                set({ isSignedUp: true });
                const response = await api.post('/auth/signup', { fullName, email, password });
                toast.success("Signup successful! You can now log in.");
                set({ isAuthenticated: true });
                set({ userData: response.data.user });
                get().connectSocket();
            }
            catch (error:any) {
                console.error('Signup failed:', error);
                toast.error(`${error.response?.data?.message || 'Signup failed. Please try again.'}`);
                set({ isAuthenticated: false });
            } finally {
                set({ isSignedUp: false });
            } 
        },

        logout: async () => {
            await api.post('/auth/logout');
            set({ isAuthenticated: false });
            set({userData:null})
            get().disconnectSocket();
        },

        checkAuth: async () => {
            try {
                const response = await api.get('/auth/check');
                // console.log('Auth check response:', response.data);
                set({ isAuthenticated: true });
                set({ userData: response.data.user });
                get().connectSocket();

            } catch(error) {
                set({ isAuthenticated: false });
                console.log( 'Auth check failed:', error);
            } finally {
                console.log('Finished auth check');
                set({ isCheckingAuth: false });
            }
            
        },

        updateProfile : async (profilePic) => {
            try {
                set({ isUpdatingProfile: true });
                const response = await api.put("/user/update-profile", profilePic , {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
                set({ userData: response.data.user });
                toast.success("Profile updated successfully!");
            } catch (error) {
                console.error('Profile update failed:', error);
                toast.error(`${(error as any).response?.data?.message || 'Profile update failed. Please try again.'}`);
            } finally {
                set({ isUpdatingProfile: false });
            }
        },

        connectSocket :() => {
            const {userData } = get();
            if(!userData || get().socket?.connected) return;

            const socket = io(BASE_URL,{
                query:{
                    userId :userData._id
                }
            });
            socket.connect();
            set({socket:socket});

            socket.on('getOnlineUsers',(userIds)=>{
                console.log('got ana user id online',userIds)
                set({onlineUsers:userIds})
            });
            console.log(get().onlineUsers)
        },

        disconnectSocket:()=>{
            if(get().socket?.connected) get().socket?.disconnect();
        }
    }
});