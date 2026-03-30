import type SentAnswer from "./SentAnswers";
import type { Team } from "./Team";

export default interface Shot {
    iD?: number,
    answerID?: number,
    TargetTeamID: number,
    IsSuccessful: boolean,
    sent_answer: SentAnswer,
    targetTeam: Team
}