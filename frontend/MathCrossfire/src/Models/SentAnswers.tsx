import type { Game } from "./Game";
import type Shot from "./Shot";
import type { Task } from "./Task";
import type { Team } from "./Team";
import type User from "./User";

export default interface SentAnswer {
    Id: number,
    Answer: string,
    UserLogin: string,
    taskID: number,
    TeamID: number,
    gameID: number,
    Correctness: boolean,
    sentTime: Date,
    User: User,
    Shot: Shot,
    Task: Task,
    Team: Team,
    Game: Game
}