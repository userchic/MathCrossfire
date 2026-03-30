import { useEffect, useState } from "react"
import { GetGames } from "../../Services/HomeService"
import type { Game } from "../../Models/Game"
import { Link, useNavigate } from "react-router";
import { store } from "../../Store";
import { mapJson } from "../../JsonRefParser";

export default function GamesList() {
    const navigate = useNavigate()
    const [Loading, setLoading] = useState(true)
    const [Games, setGames] = useState<Game[]>([])
    const [isAuthenticated, setisAuthenticated] = useState<boolean>(!!store.getState().Auth.isAuthenticated)

    store.subscribe(() => {
        setisAuthenticated(!!store.getState().Auth.isAuthenticated)
    })
    useEffect(() => {
        let res = GetGames()
        res.then((games) => {
            let gamesJson = mapJson(JSON.parse(games))
            setGames(gamesJson)
            setLoading(false)
        })
    }, [])
    function EvaluateGameStatus(game: Game): string {
        let StartDate: Date = new Date(game.StartDate)
        let EndDate = new Date(game.StartDate)
        EndDate.setMinutes(EndDate.getMinutes() + game.Lenga)
        if (new Date() < StartDate) {
            return "Запланирована"
        }
        if (!game.GameEnded && new Date() < EndDate)
            return "Проходит"
        return "Закончилась"
    }
    return (
        <>
            <div className="block">
                <h2>Игры</h2>
                {isAuthenticated ? <Link to={"/Games/Creator"}>Запланировать игру</Link> : null}
                <br />
                {Loading ?
                    "Загрузка..."
                    :
                    <div style={{ maxHeight: "80vh", overflow: "auto", width: "80%" }}>
                        <table border="5px">
                            <thead>
                                <tr>
                                    <th>
                                        Название
                                    </th>
                                    <th>
                                        Дата/Время начала
                                    </th>
                                    <th>
                                        Статус
                                    </th>
                                    <th>
                                        Длительность(мин)
                                    </th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    Games.map((game) => {
                                        let startDate = new Date(game.StartDate)
                                        return (
                                            <>
                                                <tr>
                                                    <td>
                                                        {game.Name}
                                                    </td>
                                                    <td>
                                                        {startDate.toLocaleString()}
                                                    </td>
                                                    <td>
                                                        {EvaluateGameStatus(game)}
                                                    </td>
                                                    <td>
                                                        {game.Lenga} мин
                                                    </td>
                                                    <td>
                                                        <input type="button" value="Просмотреть" onClick={() => { navigate("/Game/" + game.ID) }} />
                                                        <input type="button" value="Команды" onClick={() => { navigate(`/Teams/${game.ID}`) }} />
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </>
    )
}