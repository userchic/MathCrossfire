import { Link, useNavigate, useParams } from "react-router";
import { GetTeams } from "../../Services/GameService";
import { useEffect, useState } from "react";
import type { Team } from "../../Models/Team";
import { mapJson } from "../../JsonRefParser";

export default function TeamsInterface() {
    let params = useParams()
    let gameId = params.gameId
    const navigate = useNavigate()
    const [Teams, setTeams] = useState<Team[]>([])
    const [Message, setMessage] = useState("")
    useEffect(() => {
        GetTeams(parseInt(gameId)).then((response) => {
            if (response.ok) {
                response.json().then((body) => {
                    let teamsJson = mapJson(JSON.parse(body))
                    setTeams(teamsJson)
                })
            }
            else {
                setMessage("Не найдена игра с указанным идентификатором")
            }
        })
    }, [])
    return (
        <>
            <div className="block">
                <h2>Команды игры</h2>
                <Link to={`/Teams/Creator/${gameId}`}>Создать команду</Link>
                <table border="5px">
                    <thead>
                        <tr>
                            <th>
                                Название команды
                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Teams.map((team) =>
                                <>
                                    <tr>
                                        <td>
                                            {team.Name}
                                        </td>
                                        <td>
                                            <input type="button" value="Подробнее" onClick={() => { navigate(`/Team/${team.Id}`) }} />
                                        </td>
                                    </tr>
                                </>
                            )
                        }
                    </tbody >
                </table>
            </div>
        </>
    )
}