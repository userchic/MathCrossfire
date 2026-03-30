import type { Game } from "./Game";
import type SentAnswer from "./SentAnswers";
import type User from "./User";

export interface Team {
    Id: number,
    GameId: number,
    Name: string,
    Score: number,
    Game: Game,
    Users: User[],
    Answers: SentAnswer[]
}