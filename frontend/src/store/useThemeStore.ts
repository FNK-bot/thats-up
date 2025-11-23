import {create } from "zustand";
import {LocalStorageNames } from "../constants";

export interface ThemeState {
  theme: string;
  setTheme: (theme:string) => void;
}

export const useThemeStore = create<ThemeState>( set =>{
    return {
        theme: window.localStorage.getItem(LocalStorageNames.THEME) || 'retro',
        setTheme: (theme) => {
            window.localStorage.setItem(LocalStorageNames.THEME,theme);
            set({ theme })},
    };
})