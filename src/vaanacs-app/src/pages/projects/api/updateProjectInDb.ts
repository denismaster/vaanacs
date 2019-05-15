import { notification } from "antd";
import { apiUrl } from "../../../constants";
import { ProjectViewModel } from "../models/ProjectViewModel";

export function updateProjectInDb(patch: any, userId: string): Promise<ProjectViewModel> {
    return fetch(`${apiUrl}/api/projects/${userId}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
    })
        .then(results => results.json())
        .catch(e => notification.error({
            message: "Ошибка",
            description: 'Не удалось обновить проект' + e.message
        }))
}