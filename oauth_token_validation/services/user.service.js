class UserService {

    constructor(){
        this.apiUrl = process.env.API_URL || "localhost:3000";
    }

    async me(accessToken){
        const body = new URLSearchParams({
            access_token: accessToken
        });

        const response = await fetch(`${this.apiUrl}/userinfo?` + body, {method: "get"});
        var json = await response.json();
        if(response.ok){
            return json.name;
        }
        else{
            throw Error(json.message);
        }
    }
}

const userService = new UserService();

module.exports = {
    userService
}