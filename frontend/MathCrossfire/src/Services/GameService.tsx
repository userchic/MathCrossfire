import { url } from "./ServerName"
const controllerName = "Gamer"
const requestBase = url + "/" + controllerName + "/"

export async function GetGame(gameId: number) {
    let request = requestBase + "GetGame" + "?" + "gameId=" + gameId
    let res = await fetch(request, {
        credentials: "include",
    })
    return res;
}
export async function GetTeams(gameId: number) {
    let request = requestBase + "GetTeams" + "?" + "gameId=" + gameId
    let res = await fetch(request, {
        credentials: "include",
    })
    return res;
}
export async function GetTeam(teamId: number) {
    let request = requestBase + "GetTeam" + "?" + "teamId=" + teamId
    let res = await fetch(request, {
        credentials: "include",
    })
    return res;
}
export async function CreateTeam(gameId: number, teamName: string) {
    let request = requestBase + "CreateTeam" + "?" + "gameId=" + gameId + "&" + "teamName=" + teamName
    let res = await fetch(request, {
        credentials: "include",
        method: "POST",
    })
    return res.json();
}
export async function JoinTeam(teamId: number) {
    let request = requestBase + "JoinTeam" + "?" + "teamId=" + teamId
    let res = await fetch(request, {
        credentials: "include",
        method: "POST",
    })
    return res.json();
}
export async function LeaveTeam(teamId: number) {

    let request = requestBase + "LeaveTeam"
    let res = await fetch(request, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json;",
        },
        body: JSON.stringify({ teamId: teamId })
    })
    return res.json();
}
export async function SendAnswer(targetTeamId: number, gameId: number, teamId: number, taskId: number, answer: string) {

    let request = requestBase + "SendAnswer" + "?" + "targetTeamId=" + targetTeamId + "&" + "gameId=" + gameId + "&" + "teamId=" + teamId + "&" + "answer=" + answer + "&" + "taskId=" + taskId
    let res = await fetch(request, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json;",
        },
        body: JSON.stringify({
            targetTeamId: targetTeamId,
            gameId: gameId,
            teamId: teamId,
            taskId: taskId,
            answer: answer
        })
    })
    return res.json();
}