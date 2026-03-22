// login - api/auth/login
// signup - api/auth/signup
class AuthService
{
    url = import.meta.env.VITE_BACKEND_URL;

    async loginUser(email, password)
    {
        let response;

        try{
            response = await fetch(
                this.url + "api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );
        }
        catch(err)
        {
            console.log(err);
        }

        if(response.status == 404)
            return { success: false, message: "Invalid Email" };
        if(response.status == 400)
            return { success: false, message: "Invalid password" };
        if(response.status == 500)
            return { success: false, message: "Internal server error" };

        // response = { token }
        const token = (await response.json()).token;

        localStorage.setItem("token", token);

        return { success: true, token };
    }

    async signUp(name, email, password, username)
    {
        let response;

        try{
            response = await fetch(
                this.url + "api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        username
                    })
                }
            );
        }
        catch(err)
        {
            console.log(err);
        }

        if(response.status == 400)
            return { success: false, message: "User already exists" };
        if(response.status == 500)
            return { success: false, message: "Internal server error" };
            
        // response = { message }
        const message = (await response.json()).message;
        return { success: true, message  };
    }

    getToken()
    {
        const token = localStorage.getItem("token");
        if (!token) return null;

        // check for expiration of token, if expire return null
        try
        {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            if(payload.exp && payload.exp > currentTime)
            {
                return token; 
            } 
            else
            {
                this.logout();
                return null;
            }
        } 
        catch(err)
        {
            console.error("Error decoding JWT:", err);
            return null;
        }
    }


    logout()
    {
        localStorage.removeItem("token");
    }

    getUserData()
    {
        const token = this.getToken();
        return token ? JSON.parse(atob(token.split('.')[1])) : null;
    }
}

export default AuthService;