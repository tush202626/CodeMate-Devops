import AuthService from "./authService";

class RoomService
{
    authService = new AuthService();
    url = `${import.meta.env.VITE_BACKEND_URL}api/room`;

    async getRoomsByUsername(username)
    {
        let response;
        const token = this.authService.getToken();
        try
        {
            response = await fetch(
                this.url + "/user/" + username,
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

        if(response.status == 404)
            return { success: false, message: "User not found" };

        const rooms = await response.json();
        return { success: true,  rooms: rooms };
    }

    async getRoomById(id)
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
        
        if(response.status != 200)
            return { success: false, message: data.message };

        const {room} = data;
        return { success: true,  room: room };

    }

    async createRoom(owner, title)
    {
        const token = this.authService.getToken();
        let response;

        try
        {
            response = await fetch(
                this.url + "/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ owner, title })
                }
            );
        }
        catch(err)
        {
            console.log(err);
        }

        if(response.status == 404)
            return { success: false, message: "User does not exist" }   
        if(response.status == 500)
            return { success: false, message: "Error creating room" }
        
        const data = await response.json();

        return { success: true, message: data.message, room: data.room };
        
    }

    async addFile(roomId, file)
    { 
        const token = this.authService.getToken();
        let response;

        try
        {
            response = await fetch(
                this.url + "/add-file",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId, file })
                }
            )
        }
        catch(err)
        {
            console.log(err);
        }

        const data = await response.json();

        if(response.status == 400)
            return { success: false, message: 'File with same already exists' };
        if(response.status == 404)
            return { success: false, message: 'Room not found' };
        if(response.status == 500)
            return { success: false,  message: data.error };

        return { success: true, message: data.message, file: data.file };
    }

    async addMessage(roomId, message, user)
    {
        const token = this.authService.getToken();
        let response;

        try
        {   
            response = await fetch(
                this.url + "/add-message",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId, message, user })
                }
            )
        }
        catch(err)
        {
            console.log(err);
        }
        
        if(response.status == 404)
            return { success: false, message: 'User / Room not found' };
        if(response.status == 500)
            return { success: false, message: 'Error in sending message' };

        const data = await response.json();
        
        return { success: true, message: data.message, room: data.room };

    }

    async updateFileName(roomId, fileId, newFileName)
    {
        const token = this.authService.getToken();
        let response;

        try
        {
            response = await fetch(
                this.url + "/update-file-name",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId, fileId, newFileName })
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

        return { success: true, message: data.message, file: data.file };
    }

    async updateCode(roomId, fileId, code)
    {
        const token = this.authService.getToken();
        let response;

        try
        {
            response = await fetch(
                this.url + "/update-file-content",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomId, fileId, code })
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

        return { success: true, message: data.message, file: data.file };
    }

    async deleteFile(roomId, fileId)
    {
        const token = this.authService.getToken();
        let response;

        try
        {
            response = await fetch(
                this.url + "/delete-file",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }, 
                    body: JSON.stringify({ roomId, fileId })
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

        return { success: true, message: data.message };
    }

}

export default RoomService;