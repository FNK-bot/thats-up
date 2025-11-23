

export interface User {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
    password?: string;
    updatedAt?: string;
    createdAt?: string;
    timeStamp?: number;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    timestamp: number;
    createdAt?: string;
    updatedAt?: string;
}


export interface LoginForm {
    fullName: string;
    email: string;
    password: string;
}
