export function useUserRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role;
}