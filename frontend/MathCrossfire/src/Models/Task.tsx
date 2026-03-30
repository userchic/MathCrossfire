import type { Game } from "./Game";
import type SentAnswer from "./SentAnswers";

export interface Task {
    Text: string,
    Answer: string,
    Id?: number,
    Game: Game[],
    UsersAnswers: SentAnswer[]
}