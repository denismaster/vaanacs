import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Icon, Skeleton, PageHeader } from 'antd';
import { Typography } from 'antd';
import { RouteComponentProps } from 'react-router';
import { EditableTagGroup } from '../../components/EditableTagGroup';
import { apiUrl, gridGutter } from '../../constants';
import { notification } from 'antd';
const { Text, Paragraph } = Typography;

const ButtonGroup = Button.Group;

interface ProjectViewRouteParams {
    id: string;
}

interface ProjectViewProps extends RouteComponentProps<ProjectViewRouteParams> {
}

interface ProjectViewModel {
    name: string;
    description: string;
    stars: number;
    tags: string[];
}

export function ProjectView({ match }: ProjectViewProps) {
    const userId = match.params.id;

    const [project, setProject] = useState<ProjectViewModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`${apiUrl}/api/projects/${userId}`)
            .then(results => results.json())
            .then(data => setProject(data))
            .catch(e => notification.error({
                message: "Ошибка",
                description: 'Не удалось получить данные'
            }))
            .finally(() => setLoading(false));
    }, []);

    const updateProject = (patch: any) => fetch(`${apiUrl}/api/projects/${userId}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
    })
        .then(results => results.json())
        .then(data => setProject(data))
        .then(_ => notification.success({
            message: "Проект успешно обновлен"
        }))
        .catch(e => notification.error({
            message: "Ошибка",
            description: 'Не удалось обновить проект' + e.message
        }))

    return (
        <Skeleton loading={loading}>
            <PageHeader
                title={<Text editable={{ onChange: (value) => updateProject({ name: value }) }}>{project && project.name}</Text>}
                tags={<EditableTagGroup tags={project ? project.tags : []} onChange={(t) => updateProject({ tags: t })} />}
                extra={[
                    <Button>
                        <Icon type="setting" /> Параметры
                    </Button>,
                    <Button>
                        <Icon type="star" /> 3
                    </Button>
                ]}
            >
                <Paragraph editable={{ onChange: (value) => updateProject({ description: value }) }} >{project && project.description}</Paragraph>
            </PageHeader>
        </Skeleton>
    )
}
