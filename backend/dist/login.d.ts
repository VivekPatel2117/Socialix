declare function loginUser(email: string, password: string): Promise<{
    id: string;
    email: string;
    message: string;
}>;
export { loginUser };
