const jwt = require("jsonwebtoken");

class AppTokenService {

    constructor(){
        this.apiUrl = process.env.API_URL || "localhost:3000";
        this.clientId = process.env.CLIENT_ID || "";
        this.clientSecret = process.env.CLIENT_SECRET || "";
        this.audience = process.env.AUDIENCE || "";
        this.appAccessToken = "";
    }

    async getAppAccessToken(){
        if(this.appAccessToken && !this.isTokenExpired(this.appAccessToken)){
            return this.appAccessToken;
        }
        console.log("Token is expired");
        return await this.fetchAccessToken();
    }

    async fetchAccessToken(){
        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: this.clientId,
            client_secret: this.clientSecret,
            audience: this.audience
        });

        const response = await fetch(`${this.apiUrl}/oauth/token`, {method: "POST", body: body});
        var json = await response.json();
        if(response.ok){
            this.appAccessToken = json.access_token;
            return this.appAccessToken;
        }
        else{
            throw Error(json.message);
        }
    }

    async refreshUserToken(refreshToken){
        const body = new URLSearchParams({
            grant_type: "refresh_token",
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: refreshToken
        });

        const response = await fetch(`${this.apiUrl}/oauth/token`, {method: "POST", body: body})
        var json = await response.json();
        if(response.ok){
            return json.access_token;
        }
        else{
            throw Error(json.message);
        }
    }

    isTokenExpired(token){
        const { exp } = jwt.decode(token);
        const now = Math.floor(Date.now() / 1e3);
        return exp - now < 1200000;
    }
}
const appTokenService = new AppTokenService()
module.exports = {appTokenService};