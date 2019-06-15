import { apiUrl } from "../../../constants";

export function deleteProject(projectId: string): Promise<any> {
    return fetch(`${apiUrl}/api/projects/${projectId}`, {
        method: "DELETE",
        mode: "cors"
    });
}