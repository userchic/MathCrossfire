import type { Team } from "./Team";

export default interface User {
    Login: string,
    Password: string,
    Name: string,
    Surname: string,
    Fatname: string,
    Teams: Team[]
}