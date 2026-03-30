import type { Task } from "./Task";
import type { Team } from "./Team";

export interface Game {
    Name: string,
    StartDate: Date,
    Lenga: number,
    ID?: number,
    GameEnded: boolean,
    Tasks: Task[],
    Teams: Team[]
}