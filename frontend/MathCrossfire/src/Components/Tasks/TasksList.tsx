import { useEffect, useState } from "react"
import { GetTasks } from "../../Services/AdminService"
import type { Task } from "../../Models/Task"
import { Link } from "react-router"
import { mapJson } from "../../JsonRefParser"

export default function TasksList() {
    const [Loading, setLoading] = useState(true)
    const [Tasks, setTasks] = useState<Task[]>([])
    useEffect(() => {
        let res = GetTasks()
        res.then((tasks) => {
            let tasksJson = mapJson(JSON.parse(tasks))
            setTasks(tasksJson)
            setLoading(false)
        })
    }, [])
    return (
        <>
            <div className="block">
                <h2>Задачи</h2>
                <Link to={"/Tasks/Creator"}>Создать задачи</Link>
                <br />
                {Loading ?
                    "Загрузка..."
                    :
                    <div style={{ maxHeight: "80vh", overflow: "auto", width: "80%" }}>
                        <table border="5px" style={{ maxHeight: "80vh" }}>
                            <thead>
                                <tr>
                                    <th>
                                        Текст
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Tasks.map((task) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td>
                                                        {task.Text}
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