"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const db_1 = require("../../lib/db");
class UserService {
    static CreateUser(request) {
        const { firstName, lastName, email, password, profileImageUrl } = request;
        const salt = (0, crypto_1.randomBytes)(32).toString('hex');
        const hashedPassword = (0, crypto_1.createHmac)("sha256", salt)
            .update(password)
            .digest("hex");
        return db_1.prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                profileImageUrl,
                salt,
            },
        });
    }
}
exports.default = UserService;
