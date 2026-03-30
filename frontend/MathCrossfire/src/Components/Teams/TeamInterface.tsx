import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { GetTeam, JoinTeam } from "../../Services/GameService"
import type { Team } from "../../Models/Team"
import { mapJson } from "../../JsonRefParser"
import { store } from "../../Store"

export default function TeamInterface() {
    const params = useParams()
    const teamId = params.teamId
    const [Team, setTeam] = useState<Team | undefined>(undefined)
    const [IsUserInTeam, setIsUserInTeam] = useState(false)
    const [Message, setMessage] = useState("")
    useEffect(() => {
        getTeam()

    }, [])
    function getTeam() {
        GetTeam(teamId).then((response) => {
            if (response.ok) {
                response.json().then((body) => {
                    let jsonBody: Team = mapJson(JSON.parse(body))
                    setTeam(jsonBody)
                    if (jsonBody.Users.find((user) => user.Login == store.getState().Auth.login) !== undefined) {
                        setIsUserInTeam(true)
                    }
                })
            }
            else
                setMessage("Не найдена запрашиваемая команда")
        })
    }
    function handleJoinTeam(event: MouseEvent<HTMLInputElement, MouseEvent>): void {
        JoinTeam(Team.Id).then((body) => {
            alert(body.message)
            if (body.success)
                getTeam()
        })
    }

    return (
        <>
            <h2>Команда "{Team?.Name}"</h2>{IsUserInTeam ? null : <input type="button" onClick={handleJoinTeam} value="Присоединиться" />}
            <div style={{ maxHeight: "80vh", overflow: "auto", width: "80%" }}>
                <table border="5px">
                    <thead>
                        <tr>
                            <th>
                                Имя
                            </th>
                            <th>
                                Фамилия
                            </th>
                            <th>
                                Отчество
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Team?.Users.map((user) =>
                            <>
                                <tr>
                                    <td>
                                        {user.Name}
                                    </td>
                                    <td>
                                        {user.Surname}
                                    </td>
                                    <td>
                                        {user.Fatname}
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}