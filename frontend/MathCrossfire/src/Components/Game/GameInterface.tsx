import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import { useParams } from "react-router"
import { GetGame, SendAnswer } from "../../Services/GameService"
import type { Game } from "../../Models/Game"
import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr"
import { url } from "../../Services/ServerName"
import { store } from "../../Store"
import { mapJson } from "../../JsonRefParser"
import type { Task } from "../../Models/Task"
import type { Team } from "../../Models/Team"
import type User from "../../Models/User"
import type SentAnswer from "../../Models/SentAnswers"
import type Shot from "../../Models/Shot"
import { useCallbackRef } from "use-callback-ref"
interface InGameTask {
    Task: Task,
    answer: string,
    targetTeamId: number,
    answerSent?: boolean,
    corectness: boolean,
    isShotSuccessful: boolean
}

export default function GameInterface() {
    let params = useParams()
    let gameId = parseInt(useRef(params.gameId).current)
    const [Login] = useState(store.getState().Auth.login)

    const [GameStarted, setGameStarted] = useState(false)
    const [GameOngoing, setGameOngoing] = useState(false)

    const [Game, setGame] = useState<Game | undefined>(undefined)

    const [InGameTasks, setInGameTasks] = useState<InGameTask[]>([])

    const [UserTeam, setUserTeam] = useState<Team | undefined>(undefined)

    const [isAuthenticated] = useState(store.getState().Auth.isAuthenticated)
    const [isParticipating, setisParticipating] = useState(false)
    const [isNotFound, setisNotFound] = useState(false)
    let Connection: HubConnection | undefined = undefined
    const [Message, setMessage] = useState("")

    let Minutes = 0
    let Seconds = 0
    let timerIndex: number
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        GetGame(gameId).then((response) => {
            setisNotFound(response.ok)
            if (response.ok) {
                response.json().then((body) => {
                    let game: Game = mapJson(JSON.parse(body))
                    let gameStarted = new Date(game.StartDate) < new Date()
                    setGameStarted(gameStarted)
                    let gameStart = new Date(game.StartDate)
                    gameStart.setMinutes(gameStart.getMinutes() + game.Lenga)
                    let gameEnd: Date = gameStart
                    game.GameEnded = game.GameEnded || gameEnd < new Date()
                    setGame(game)
                    setGameOngoing(!game.GameEnded && gameStarted && gameEnd > new Date())
                    let userTeam: Team
                    let isParticipating: boolean = false
                    if (isAuthenticated) {
                        userTeam = game?.Teams.find((team) => team.Users.filter((user) => user.Login == Login).length == 1)
                        setUserTeam(userTeam)
                        isParticipating = userTeam !== undefined
                        setisParticipating(isParticipating)
                    }
                    setInGameTasks(game.Tasks.map((task) => {
                        let userTeamAnswer = task.UsersAnswers.find((answer => answer.TeamID == userTeam?.Id))
                        let userTeamShot = userTeamAnswer?.Shot
                        return {
                            Task: task,
                            answer: userTeamAnswer !== undefined ? userTeamAnswer.Answer : "",
                            targetTeamId: userTeamShot !== undefined && userTeamShot !== null ? userTeamShot.TargetTeamID : -1,
                            answerSent: isParticipating ? task.UsersAnswers.find((answer) => answer.TeamID == userTeam?.Id) !== undefined : undefined,
                            corectness: userTeamAnswer !== undefined ? userTeamAnswer.Correctness : false,
                            isShotSuccessful: userTeamShot !== undefined && userTeamShot !== null ? userTeamShot.IsSuccessful : false

                        }
                    }))
                    if (isAuthenticated)
                        JoinGame()
                    gameEnd = new Date(game.StartDate)
                    gameEnd.setMinutes(gameEnd.getMinutes() + game.Lenga)
                    let currentTime = new Date()
                    let timer = -(currentTime.getTime() - gameEnd.getTime()) / 1000
                    if (timer > 0) {
                        Minutes = Math.floor(timer / 60)
                        setMinutes(Math.floor(timer / 60))
                        Seconds = Math.floor(timer % 60)
                        setSeconds(Math.floor(timer % 60))
                        clearInterval(timerIndex)
                        timerIndex = setInterval(() => {
                            if (Seconds > 0) {
                                Seconds = Seconds - 1
                                setSeconds(Seconds)
                            }
                            else
                                if (Minutes > 0) {
                                    Minutes = Minutes - 1
                                    Seconds = 59
                                    setMinutes(Minutes)
                                    setSeconds(59)
                                }
                                else {
                                    clearInterval(timerIndex)
                                    EndGame()
                                    alert("Игра закончена по времени")
                                }
                        }, 1000)
                    }
                    else {
                        clearInterval(timerIndex)
                    }
                })
            }
            else
                setMessage("Не найдена запрашиваемая игра")

            return () => {
                if (isAuthenticated)
                    Connection?.stop()
            }
        })
    }, [])

    function EndGame() {
        setGameOngoing(false)
        setGame((currentGameState) => {
            let newGameState: Game = Object.assign(currentGameState)
            newGameState.GameEnded = true;
            return newGameState
        })
    }

    function JoinGame() {
        let connectionUrl = `${url}/gameHub`
        let connection = new HubConnectionBuilder().withUrl(connectionUrl).withServerTimeout(3600000).build()

        connection?.onclose(() => {
            console.log("Соединение разорвано/закончено")
        })
        connection.on("EndGameMessage", (gameId: number) => {
            EndGame()
            alert("Игра закончена, все ответы от команд отправлены")
        })
        connection.on(("SolvedTaskMessage"), (solverLogin: string, taskId: number, teamId: number, targetTeamId: number, Correctness: boolean, isShotSuccessful: boolean) => {
            setGame((gameState) => {
                let taskIndex = gameState.Tasks.findIndex((task) => task.Id == taskId)
                let teamIndex = gameState.Teams.findIndex((team) => team.Id === teamId)
                let targetTeamIndex = gameState.Teams.findIndex((team) => team.Id === targetTeamId)

                setInGameTasks((InGameTasks) => {
                    let inGameTasks = InGameTasks
                    let inGameTask = InGameTasks.find(task => task.Task.Id == taskId)
                    inGameTask.corectness = Correctness
                    inGameTask.isShotSuccessful = isShotSuccessful
                    return InGameTasks
                })
                let sentAnswer: SentAnswer = {
                    Correctness: Correctness,
                    gameID: gameState.ID,
                    sentTime: new Date(),
                    taskID: taskId,
                    task: gameState?.Tasks[taskIndex],
                    TeamID: teamId,
                    team: gameState?.Teams[teamIndex],
                }
                if (gameState?.Teams[teamIndex].Answers !== null)
                    gameState?.Teams[teamIndex].Answers.concat(sentAnswer)
                else
                    gameState.Teams[teamIndex].Answers = [sentAnswer]

                if (gameState?.Tasks[taskIndex].UsersAnswers !== null)
                    gameState?.Tasks[taskIndex].UsersAnswers.concat(sentAnswer)
                else
                    gameState.Tasks[taskIndex].UsersAnswers = [sentAnswer]

                if (Correctness) {
                    let shot: Shot = {
                        IsSuccessful: isShotSuccessful,
                        TargetTeamID: targetTeamId,
                        sent_answer: sentAnswer,
                        targetTeam: gameState.Teams[targetTeamIndex],
                    }
                }
                setUserTeam((userTeam) => {
                    if (gameState?.Teams[teamIndex].Id !== userTeam?.Id)
                        alert(`Команда "${gameState?.Teams[teamIndex].Name}" ответила на задачу ${taskIndex + 1} ${Correctness ? `правильно и ${targetTeamId !== -1 ? `произвела выстрел по команде ${gameState?.Teams[teamIndex].Name} который был ${isShotSuccessful ? "успешным" : "безуспешным"}` : "не произвела выстрел"}` : "неправильно"}`)
                    else
                        if (solverLogin !== Login)
                            alert(`${solverLogin} от вашей команды решил задачу ${taskIndex + 1} ${Correctness ? `правильно и ${targetTeamId !== -1 ? `произвел выстрел по команде ${gameState?.Teams[teamIndex].Name} который был ${isShotSuccessful ? "успешным" : "безуспешным"}` : "не произвела выстрел"}` : "неправильно"}`)
                    return userTeam
                })
                return gameState
            })
        })

        connection?.start().then(
            () => {
                connection.send("ConnectToTheGame", gameId, store.getState().Auth.login)
                Connection = connection
            }
        )

    }

    return (
        <>

            <h2 style={{ whiteSpace: "pre", overflowX: "auto", overflowY: "hidden" }}>Перестрелка "{Game?.Name}"</h2>
            <div style={{ display: "flex" }}>
                <div style={{ flex: "0.1" }}>
                    {Game?.GameEnded ? <strong>Закончена</strong> : null}
                </div>
                {GameStarted ?
                    <div style={{ flex: "0.7" }}>
                        <center><h3>Задачи</h3></center>
                    </div> : null}
                {GameOngoing ?
                    <div style={{ flex: "0.3" }}>
                        <center> Время до конца перестрелки: {minutes} : {seconds.toString().padStart(2, '0')}</center>
                    </div> : null
                }
            </div>
            {<>{Message} {Message ? <br /> : null}</>}
            {
                isNotFound ?
                    <>{
                        GameStarted ?
                            <div style={{ maxHeight: "45vh", overflow: "auto", width: "80%" }}>
                                <table border="5px">
                                    <thead>
                                        <tr>
                                            <th>
                                                Номер
                                            </th>
                                            <th>
                                                Текст задачи
                                            </th>
                                            <th>
                                                Цель выстрела
                                            </th>
                                            <th>
                                                Ваш ответ
                                            </th>
                                            <th>
                                                Правильность ответа
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {InGameTasks.map((task, index) => {
                                            function handleAnswerChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
                                                let currentTasks = InGameTasks
                                                let taskIndex = currentTasks.findIndex((t) => t.Task.Id == task.Task.Id)
                                                currentTasks[taskIndex].answer = event.target.value

                                                setInGameTasks([...currentTasks])
                                            }

                                            async function handleSendAnswer() {
                                                SendAnswer(task.targetTeamId, Game.ID, UserTeam?.Id, task.Task.Id, task.answer).then((body) => {
                                                    if (body.success !== undefined) {
                                                        if (body.success) {
                                                            let currentTasks = InGameTasks
                                                            let taskIndex = currentTasks.findIndex((t) => t.Task.Id == task.Task.Id)
                                                            currentTasks[taskIndex].answerSent = true
                                                            setInGameTasks([...currentTasks])
                                                        }
                                                        alert(body.message)
                                                    }
                                                    else
                                                        alert(Object.values(body.errors)[0])
                                                })
                                            }

                                            function handleTargetTeamIdChange(event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>): void {
                                                let currentTasks = InGameTasks
                                                let taskIndex = currentTasks.findIndex((t) => t.Task.Id == task.Task.Id)
                                                currentTasks[taskIndex].targetTeamId = parseInt(event.target.value)

                                                setInGameTasks([...currentTasks])
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        {task.Task.Text}
                                                    </td>
                                                    <td>
                                                        {task.answerSent ? Game?.Teams.find((team) => team.Id == task.targetTeamId) === undefined ? "Не было выстрела" : Game?.Teams.find((team) => team.Id == task.targetTeamId)?.Name : isParticipating && GameOngoing ? <select onChange={handleTargetTeamIdChange}>
                                                            <option value={-1} >Никто </option>
                                                            {Game?.Teams.map((team) => {
                                                                return (
                                                                    <>
                                                                        <option value={team.Id}>{team.Name}{UserTeam !== undefined && team.Id == UserTeam.Id ? "(ваша команда)" : null} </option>
                                                                    </>
                                                                )
                                                            })}
                                                        </select> : null}

                                                    </td>
                                                    <td>
                                                        {task.answerSent ? task.answer : isParticipating && GameOngoing ? <input type="text" value={task.answer} onChange={handleAnswerChange} />
                                                            : null}
                                                    </td>
                                                    <td>
                                                        {task.answerSent ? task.corectness ? "Правильный" : "Неправильный" : isParticipating && GameOngoing ? <input type="button" value="Отправить" onClick={handleSendAnswer} />
                                                            : null}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            :
                            "Перестрелка еще не началась"
                    }
                    </>
                    :
                    null
            }

        </>
    )
}