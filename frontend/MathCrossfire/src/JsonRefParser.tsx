
export function mapJson(Json: Object): Object {
    let ids: any[] = []
    mapElem(Json)
    if (Json.$values !== undefined) {
        Json = Json.$values
    }
    function mapElem(Elem: any) {
        if (Elem == null || Elem == undefined)
            return null
        if (Array.isArray(Elem)) {
            for (let i = 0; i < Elem.length; i++) {
                if (isObject(Elem[i]) && !(Elem[i].$id !== undefined && ids.find((id) => id == Elem[i].$id))) {
                    if (Elem[i].$ref !== undefined)
                        Elem[i] = FindId(Elem[i].$ref)
                    else {
                        mapElem(Elem[i])
                    }
                    if (Elem[i].$values !== undefined)
                        Elem[i] = Elem[i].$values
                }
            }
        }
        else {
            Object.keys(Elem).forEach((key) => {

                if (isObject(Elem[key]) && !(Elem[key].$id !== undefined && ids.find((id) => id == Elem[key].$id))) {
                    if (Elem[key].$ref !== undefined) {
                        Elem[key] = FindId(Elem[key].$ref)
                    }
                    else
                        mapElem(Elem[key])
                    if (Elem[key].$values !== undefined)
                        Elem[key] = Elem[key].$values
                }
                else
                    if (Array.isArray(Elem[key])) {
                        mapElem(Elem[key])
                    }
            })
        }
    }
    function FindId(Id: any) {
        let ids2: any[] = []
        let res = mapFind(Json)
        return res
        function mapFind(obj: any): any {
            if (obj.$id !== undefined && obj.$id == Id) {
                return obj
            }
            if (!(obj.$id !== undefined && ids2.find((id) => id == obj.$id)))
                ids2.push(obj.$id)
            else
                return null
            if (!Array.isArray(obj)) {
                if (isObject(obj)) {
                    for (let elem in obj) {
                        if (isObject(obj[elem])) {
                            let res = mapFind(obj[elem])
                            if (res !== null)
                                return res
                        }

                        else
                            if (Array.isArray(obj[elem])) {
                                let res = mapFind(obj[elem])
                                if (res !== null)
                                    return res
                            }
                    }
                }
            }
            else {
                for (let i = 0; i < obj.length; i++) {

                    let res = mapFind(obj[i])
                    if (res !== null)
                        return res
                }
            }
            return null
        }
    }
    return Json
}
function isObject(obj: any) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
}


//let Jsonchic = JSON.parse("{\"$id\":\"1\",\"$values\":[{\"$id\":\"2\",\"Id\":1,\"Name\":\"Game\",\"StartTime\":\"2025-07-31T09:07:43.765892Z\",\"TaskSolvingStartTime\":\"2025-07-31T09:23:00.967755Z\",\"SolvingTime\":10,\"Team1Id\":1,\"Team2Id\":2,\"AssessorPoints\":0,\"Team1Points\":0,\"Team2Points\":0,\"CaptainsRoundFormat\":\"Normal round\",\"AssessorId\":null,\"GameEnded\":false,\"ChallengingTeamId\":null,\"TeamRejectedToChallenge\":false,\"Assessor\":{\"$id\":\"3\",\"Name\":\"\Р\у\с\л\а\н\",\"Surname\":\"\Г\а\б\з\а\л\и\л\о\в\",\"Fatname\":\"\М\а\р\а\т\о\в\и\ч\",\"Login\":\"Ruslan\",\"Password\":\"1234\",\"Games\":{\"$id\":\"4\",\"$values\":[{\"$ref\":\"2\"}]}},\"CaptainsRound\":null,\"Tasks\":{\"$id\":\"5\",\"$values\":[{\"$id\":\"6\",\"Id\":1,\"Text\":\"1\+2=\",\"Games\":{\"$id\":\"7\",\"$values\":[{\"$ref\":\"2\"},{\"$id\":\"8\",\"Id\":2,\"Name\":\"Game2\",\"StartTime\":null,\"TaskSolvingStartTime\":null,\"SolvingTime\":10,\"Team1Id\":3,\"Team2Id\":4,\"AssessorPoints\":0,\"Team1Points\":0,\"Team2Points\":0,\"CaptainsRoundFormat\":\"Normal Round\",\"AssessorId\":null,\"GameEnded\":false,\"ChallengingTeamId\":null,\"TeamRejectedToChallenge\":false,\"Assessor\":null,\"CaptainsRound\":null,\"Tasks\":{\"$id\":\"9\",\"$values\":[{\"$ref\":\"6\"},{\"$id\":\"10\",\"Id\":2,\"Text\":\"1\+3=\",\"Games\":{\"$id\":\"11\",\"$values\":[{\"$ref\":\"2\"},{\"$ref\":\"8\"}]},\"Rounds\":null},{\"$id\":\"12\",\"Id\":3,\"Text\":\"1\+4=\",\"Games\":{\"$id\":\"13\",\"$values\":[{\"$ref\":\"2\"},{\"$ref\":\"8\"}]},\"Rounds\":null},{\"$id\":\"14\",\"Id\":4,\"Text\":\"1\+5=\",\"Games\":{\"$id\":\"15\",\"$values\":[{\"$ref\":\"2\"},{\"$ref\":\"8\"}]},\"Rounds\":null},{\"$id\":\"16\",\"Id\":5,\"Text\":\"1\+6=\",\"Games\":{\"$id\":\"17\",\"$values\":[{\"$ref\":\"2\"},{\"$ref\":\"8\"}]},\"Rounds\":null}]},\"Challenges\":{\"$id\":\"18\",\"$values\":[]},\"Team1\":{\"$id\":\"19\",\"Id\":3,\"CaptainId\":2,\"ViceCaptainId\":3,\"Name\":\"Team1\",\"Students\":{\"$id\":\"20\",\"$values\":[{\"$id\":\"21\",\"Id\":1,\"Name\":\"\Н\и\к\и\т\а\",\"Surname\":\"\Р\у\д\и\к\",\"Fatname\":\"\В\и\т\а\л\ь\е\в\и\ч\",\"Email\":\"\",\"Teams\":{\"$id\":\"22\",\"$values\":[{\"$id\":\"23\",\"Id\":2,\"CaptainId\":5,\"ViceCaptainId\":1,\"Name\":\"Team2\",\"Students\":{\"$id\":\"24\",\"$values\":[{\"$ref\":\"21\"},{\"$id\":\"25\",\"Id\":3,\"Name\":\"\В\о\в\а\",\"Surname\":\"\А\в\о\в\а\",\"Fatname\":\"\М\о\ц\а\р\т\о\в\и\ч\",\"Email\":\"\",\"Teams\":{\"$id\":\"26\",\"$values\":[{\"$ref\":\"23\"},{\"$ref\":\"19\"}]},\"SpeakerRounds\":null,\"OpponentRounds\":null},{\"$id\":\"27\",\"Id\":5,\"Name\":\"\Х\е\л\е\н\а\",\"Surname\":\"\О\с\и\п\о\в\н\а\",\"Fatname\":\"\Н\и\к\о\л\а\с\о\в\н\а\",\"Email\":\"\",\"Teams\":{\"$id\":\"28\",\"$values\":[{\"$ref\":\"23\"},{\"$id\":\"29\",\"Id\":4,\"CaptainId\":5,\"ViceCaptainId\":4,\"Name\":\"Team2\",\"Students\":{\"$id\":\"30\",\"$values\":[{\"$id\":\"31\",\"Id\":4,\"Name\":\"\Д\ж\о\",\"Surname\":\"\В\и\г\и\н\",\"Fatname\":\"\А\л\е\к\с\а\н\д\р\о\в\и\ч\",\"Email\":\"\",\"Teams\":{\"$id\":\"32\",\"$values\":[{\"$id\":\"33\",\"Id\":1,\"CaptainId\":2,\"ViceCaptainId\":4,\"Name\":\"Team1\",\"Students\":{\"$id\":\"34\",\"$values\":[{\"$id\":\"35\",\"Id\":2,\"Name\":\"\В\а\с\я\",\"Surname\":\"\В\а\с\н\и\н\",\"Fatname\":\"\И\н\н\о\к\е\н\т\и\е\в\и\ч\",\"Email\":\"\",\"Teams\":{\"$id\":\"36\",\"$values\":[{\"$ref\":\"33\"},{\"$ref\":\"19\"}]},\"SpeakerRounds\":null,\"OpponentRounds\":null},{\"$ref\":\"31\"}]},\"Changes\":null,\"Breaks\":null,\"Rounds\":null,\"Captain\":{\"$ref\":\"35\"},\"ViceCaptain\":{\"$ref\":\"31\"}},{\"$ref\":\"29\"}]},\"SpeakerRounds\":null,\"OpponentRounds\":null},{\"$ref\":\"27\"}]},\"Changes\":null,\"Breaks\":null,\"Rounds\":null,\"Captain\":{\"$ref\":\"27\"},\"ViceCaptain\":{\"$ref\":\"31\"}}]},\"SpeakerRounds\":null,\"OpponentRounds\":null}]},\"Changes\":null,\"Breaks\":null,\"Rounds\":null,\"Captain\":{\"$ref\":\"27\"},\"ViceCaptain\":{\"$ref\":\"21\"}},{\"$ref\":\"19\"}]},\"SpeakerRounds\":null,\"OpponentRounds\":null},{\"$ref\":\"35\"},{\"$ref\":\"25\"}]},\"Changes\":null,\"Breaks\":null,\"Rounds\":null,\"Captain\":{\"$ref\":\"35\"},\"ViceCaptain\":{\"$ref\":\"25\"}},\"Team2\":{\"$ref\":\"29\"}}]},\"Rounds\":null},{\"$ref\":\"10\"},{\"$ref\":\"12\"},{\"$ref\":\"14\"},{\"$ref\":\"16\"}]},\"Challenges\":{\"$id\":\"37\",\"$values\":[]},\"Team1\":{\"$ref\":\"33\"},\"Team2\":{\"$ref\":\"23\"}},{\"$ref\":\"8\"}]}")
//console.log(mapJson(Jsonchic))