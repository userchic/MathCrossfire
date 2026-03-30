import type { Game } from "../Models/Game";
import { url } from "./ServerName"
const controllerName = "Home"
const requestBase = url + "/" + controllerName + "/"

export async function GetGames(): Promise<Game[]> {
    let request = requestBase + "GetGames";
    let response = await fetch(request,
        {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json;",
            },
        })
    return response.json()
}
export async function ExecuteLogin(login: string, password: string) {
    let request = requestBase + "Login"
    let response = await fetch(request,
        {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json;",
            },
            body: JSON.stringify({ login: login, password: password }),
        })
    return response.json()
}
export async function ExecuteRegister(login: string, password: string, name: string, surname: string, fatname: string, Class: string) {
    let request = requestBase + "Register"
    const response = await fetch(request, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json;",
        },
        body: JSON.stringify({ Login: login, Password: password, Name: name, Surname: surname, Fatname: fatname, Class: Class }),
    })
    return response.json()
}
export async function ExecuteLogOut() {
    let request = requestBase + "LogOut";
    let response = await fetch(request, {
        credentials: "include",
        method: "POST"
    })
    return response
}