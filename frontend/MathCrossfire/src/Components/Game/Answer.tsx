import type SentAnswer from "../../Models/SentAnswers";
import type { Team } from "../../Models/Team";

interface Props {
    Answer: SentAnswer
}
export default function Answer({ Answer }: Props) {
    return (
        <>
            <tr>
                <td>
                    Ответ
                </td>
                <td>
                    Отправитель {Answer.UserLogin}
                </td>
                <td>
                    Задача под номером {Answer.Game.Tasks.findIndex((task) => task.Text == Answer.Task.Text) + 1}
                </td>
                <td>
                    Ответ {Answer.Correctness ? "правильный" : "неправильный"}
                </td>
                <td>
                    {
                        Answer.Shot !== undefined && Answer.Shot !== null ?
                            <>
                                Выстрел по команде "{Answer.Shot.TargetTeam.Name}" {Answer.Shot.isSuccessful ? "успешен" : "безуспешен"}
                            </>
                            : "Выстрела не было"
                    }
                </td>
            </tr>
        </>
    )
}