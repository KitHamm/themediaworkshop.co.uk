export type UserWithoutPassword = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    position: string | null;
    image: string | null;
    activated: boolean;
    role: string;
};
