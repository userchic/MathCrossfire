import type { Task } from "../Models/Task"
import { url } from "./ServerName"
const controllerName = "Admin"
const requestBase = url + "/" + controllerName + "/"

export async function GetTasks() {
    let request = requestBase + "GetTasks"
    let res = await fetch(request, {
        credentials: "include",
    })
    return res.json();
}
export async function GetTask(taskId: number) {
    let request = requestBase + "GetTask" + "?" + "taskId=" + taskId
    let res = await fetch(request, {
        credentials: "include",
    })
    return res;
}
export async function CreateTask(text: string, answer: string) {
    let request = requestBase + "CreateTask"
    let res = await fetch(request, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json;",
        },
        body: JSON.stringify({ text: text, answer: answer }),
    })
    return res.json();
}
export async function UpdateTask(text: string, answer: string, id: number) {
    let request = requestBase + "UpdateTask"
    let res = await fetch(request, {
        credentials: "include",
        method: "PUT",
        headers: {
            "Content-Type": "application/json;",
        },
        body: JSON.stringify({ id: id, text: text, answer: answer }),
    })
    return res;
}
export async function DeleteTask(id: number) {
    let request = requestBase + "DeleteTask" + "?" + "id=" + id
    let res = await fetch(request, {
        credentials: "include",
        method: "Delete",
    })
    return res;
}
export async function CreateGame(name: string, startDate: Date, length: number, tasksIds: number[]) {
    let request = requestBase + "CreateGame"
    let res = await fetch(request, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json;",
        },
        body: JSON.stringify({ name: name, startDate: startDate, length: length, tasksIds: tasksIds }),
    })
    return res.json();
}
