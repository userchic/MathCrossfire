import { useState, type ChangeEvent } from "react"
import { CreateTeam } from "../../Services/GameService"
import { useParams } from "react-router"

export default function TeamsCreator() {
    let params = useParams()
    let gameId = params.gameId
    const [Name, setName] = useState("")
    const [Message, setMessage] = useState("")
    function handleNameChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setName(event.target.value)
    }

    function handleTeamCreation(): void {
        CreateTeam(gameId, Name).then((body) => {
            setMessage(body.message)
        })
    }

    return (
        <>
            <h2>Создание команды</h2>
            Название:<input type="text" value={Name} onChange={handleNameChange} />
            <input type="button" onClick={handleTeamCreation} value={"Создать"} />
            {Message}
        </>
    )
}