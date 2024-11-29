
const Logout = (login, navigate) => {
    console.log("LogOut function triggered");

    const token = localStorage.getItem(login);
    if (token) {
        localStorage.removeItem(login);
        console.log(`Token "${login}" removed`);
    } else {
        console.log("No token found or already removed");
    }
    navigate('/'); // Redirect to home
};

export default Logout;
