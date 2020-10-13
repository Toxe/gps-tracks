import jwt from "jsonwebtoken";

export function sampleAuthTokens(identity) {
    const access_token = jwt.sign({ identity }, "secret", { expiresIn: "15m" });
    const refresh_token = jwt.sign({ identity }, "secret", { expiresIn: "30d" });

    return { access_token, refresh_token };
}
