import { useState, type ChangeEvent } from "react"
import { CreateTask } from "../../Services/AdminService"
import TextArea from "antd/es/input/TextArea"

export default function TaskCreator() {
    const [Text, setText] = useState("")
    const [Answer, setAnswer] = useState("")
    const [Message, setMessage] = useState("")
    function handleTextChange(event: ChangeEvent<HTMLTextAreaElement, HTMLInputElement>): void {
        setText(event.target.value)
    }

    function handleAnswerChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setAnswer(event.target.value)
    }

    function handleTaskCreation(): void {
        let res = CreateTask(Text, Answer)
        res.then((body) => {
            if (body.errors === undefined) {
                setMessage(body.message)
            }
            else
                setMessage(Object.values(body.errors)[0])
        })
    }

    return (
        <>
            <div className="block">
                <h2>Создание задач</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Текст:
                            </td>
                            <td>
                                <TextArea value={Text} rows={5} cols={100} onChange={handleTextChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Ответ:
                            </td>
                            <td>
                                <input type="text" value={Answer} onChange={handleAnswerChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="button" value=" Создать " onClick={handleTaskCreation} />
                {Message}
            </div>
        </>
    )
}