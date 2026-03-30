import type Shot from "./Shot";
import type { Task } from "./Task";
import type { Team } from "./Team";
import type User from "./User";

export default interface SentAnswer {
    Id: number,
    Answer: string,
    userLogin: string,
    taskID: number,
    TeamID: number,
    gameID: number,
    Correctness: boolean,
    sentTime: Date,
    user: User,
    Shot: Shot,
    task: Task,
    team: Team
}