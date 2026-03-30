import { useEffect, useState, type ChangeEvent } from "react"
import { CreateGame, GetTasks } from "../../Services/AdminService"
import type { Task } from "../../Models/Task"
import TextArea from "antd/es/input/TextArea";
import { mapJson } from "../../JsonRefParser";

interface TaskChoice {
    task: Task;
    chosen: boolean;
}
export default function GameCreator() {
    const [Name, setName] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [Length, setLength] = useState(0)
    const [Message, setMessage] = useState("")

    const [Tasks, setTasks] = useState<TaskChoice[]>([])

    useEffect(() => {
        let res = GetTasks()
        res.then((body) => {
            setTasks(mapJson(JSON.parse(body)).map((task) => {
                return {
                    task: task,
                    chosen: false
                }
            }))
        })
    }, [])
    function handleNameChange(event: ChangeEvent<HTMLTextAreaElement, HTMLInputElement>): void {
        setName(event.target.value)
    }

    function handleStartDateChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setStartDate(event.target.value)
    }

    function handleLengthChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        setLength(parseInt(event.target.value))
    }
    function handleChoiceChange(task: Task): void {

        let currentTasks = Tasks
        let taskIndex = currentTasks.findIndex((t) => t.task.Id == task.Id)
        currentTasks[taskIndex].chosen = !currentTasks[taskIndex].chosen

        setTasks([...currentTasks])
    }
    function handleCreateGame(): void {
        let response = CreateGame(Name, new Date(StartDate), Length, Tasks.filter((task) => task.chosen === true).map((task) => task.task.Id))
        response.then((res) => {
            if (res.errors === undefined) {
                setMessage(res.message)
            }
            else
                setMessage(Object.values(res.errors)[0])
        })
    }

    return (
        <>
            <div className="block">
                <h2>Запланирование игры</h2>
                <table style={{ maxHeight: "50vh", overflow: "auto", width: "80%" }} border="5px">
                    <tbody>
                        <tr>
                            <td>
                                Название:
                            </td>
                            <td>
                                <TextArea value={Name} rows={1} cols={80} onChange={handleNameChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Дата/Время начала:
                            </td>
                            <td>
                                <input type="datetime-local" value={StartDate} onChange={handleStartDateChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Длительность (мин)
                            </td>
                            <td>
                                <input type="number" value={Length} onChange={handleLengthChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ display: "inline" }}>
                    <input type="button" value="Запланировать игру" onClick={handleCreateGame} />{Message}
                </div>
                <h3>Выберите задачи</h3>
                <div style={{ maxHeight: "50vh", overflow: "auto", width: "80%" }}>
                    <table border="5px" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>
                                    Текст задачи
                                </th>
                                <th>
                                    Выбор
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Tasks.map((choice) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>
                                                    {choice.task.Text}
                                                </td>
                                                <td>
                                                    <input type="checkbox" checked={choice.chosen} onChange={() => handleChoiceChange(choice.task)} />
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}