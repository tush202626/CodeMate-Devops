import AuthService from "./authService";

class UserService
{
    url = import.meta.env.VITE_BACKEND_URL + "api/users";
    
    authService = new AuthService();

    async getUser(username)
    {
        const token = this.authService.getToken();
        let response;

        try
        {
            response = await fetch(
                this.url + "/username/" + username,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        }
        catch(err)
        {
            console.log(err);
        }

        const data = await response.json();

        if(response.status !== 200)
            return { success: false, message: data.message };

        return { success: true, user: data.user };
    }

    async getUserById(id)
    {
        const token = this.authService.getToken();
        let response;

        try
        {
            response = await fetch(
                this.url + "/" + id,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        }
        catch(err)
        {
            console.log(err);
        }

        const data = await response.json();

        if(response.status !== 200)
            return { success: false, message: data.message };

        return { success: true, user: data.user };
    }
}

export default UserService;