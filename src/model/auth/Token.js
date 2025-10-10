
class Token {

    constructor(token, refreshToken, userName = null) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userName = userName;
    }

    getToken() {
        return this.token;
    }

    getRefreshToken() {
        return this.refreshToken;
    }

    getUserName() {
        return this.userName;
    }

    static build(response, userName) {
        if (response && response.data) {
            return new Token(response.data.token, response.data.refreshToken, userName);
        }
        throw new Error('Invalid response for token creation');

    }
}

export default Token;