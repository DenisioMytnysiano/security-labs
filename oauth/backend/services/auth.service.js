const { appTokenService } = require("../services/token.service");

class AuthService {
    constructor(){
        this.apiUrl = process.env.API_URL || "localhost:3000";
        this.clientId = process.env.CLIENT_ID || "";
        this.clientSecret = process.env.CLIENT_SECRET || "";
        this.audience = process.env.AUDIENCE || "";
    }

    async login(username, password){
        const body = new URLSearchParams({
            grant_type: "password",
            connection: "Username-Password-Authentication",
            scope: "offline_access",
            username: username,
            password: password,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            audience: this.audience
        })

        var response = await fetch(`${this.apiUrl}/oauth/token`, {method: "POST", body: body});
        if(response.ok){
            var json = await response.json()
            return {
                accessToken: json.access_token,
                refreshToken: json.refresh_token
            }
        }
        throw new Error();
    }

    async register(username, password){
        const body = new URLSearchParams({
            connection: "Username-Password-Authentication",
            email: username,
            password: password,
        })

        const headers = {
            "Authorization": `Bearer ${await appTokenService.getAppAccessToken()}`
        }

        var response = await fetch(`${this.apiUrl}/api/v2/users`, {method: "POST", body: body, headers: headers});
        var json = await response.json();
        if(!response.ok){
            throw new Error(json.message);
        }
    }

    async logout({username, password}){

    }
}

const authService = new AuthService();

module.exports = {authService};