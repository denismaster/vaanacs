import React, { useEffect, useState, FC } from 'react';
import { Col, Row, Button, Icon, Skeleton, PageHeader, Card, Collapse, Alert } from 'antd';
import { Typography } from 'antd';
import { RouteComponentProps } from 'react-router';
import { EditableTagGroup } from '../../components/EditableTagGroup';
import { apiUrl, gridGutter } from '../../constants';
import { notification } from 'antd';
import { ProjectViewModel } from './models/ProjectViewModel';
import { ProjectChart } from './components/ProjectChart';
import { ProjectParamsCard } from './components/ProjectParams';
import { updateProjectInDb } from './api/updateProjectInDb';
import { debounce } from '../../core/debouncePromise';
const { Text, Paragraph } = Typography;

const StyledRow: FC = ({ children }) => <Row gutter={gridGutter} style={{ marginBottom: '16px' }}>{children}</Row>

const debouncedUpdateProject = debounce(updateProjectInDb, 500);

interface ProjectContextProps {
    project: ProjectViewModel | null,
    updateProject: (patch: any) => void
}

export const ProjectContext = React.createContext<ProjectContextProps>({
    project: null,
    updateProject: (_) => { }
});

interface ProjectViewRouteParams {
    id: string;
}

interface ProjectViewProps extends RouteComponentProps<ProjectViewRouteParams> { }

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

    const saveProject = (patch: any, showNotification: boolean = true) => debouncedUpdateProject(patch, userId)
        .then(data => setProject(data))
        .then(_ => {
            if (showNotification) {
                notification.success({
                    message: "Проект успешно обновлен"
                })
            }
        })

    const updateProject = (patch: any) => {
        setProject({ ...project, ...patch });
        saveProject({ ...project, ...patch });
    }

    return (
        <ProjectContext.Provider value={{
            project,
            updateProject: (patch: any) => updateProject(patch)
        }}>
            {/* <Alert message="Warning" type="warning" showIcon style={{ marginBottom: '16px' }}  /> */}
            <StyledRow>
                <Col>
                    <Skeleton loading={loading}>
                        <PageHeader
                            title={<Text editable={{ onChange: (value) => saveProject({ name: value }) }}>{project && project.name}</Text>}
                            tags={<EditableTagGroup tags={project ? project.tags : []} onChange={(t) => saveProject({ tags: t })} />}
                            extra={[
                                <Button onClick={() => saveProject(project)} type="primary" key="0">
                                    <Icon type="save" /> Сохранить
                                </Button>,
                                <Button disabled key="1">
                                    <Icon type="setting" /> Параметры
                                </Button>,
                            ]}
                        >
                            <Paragraph editable={{ onChange: (value) => saveProject({ description: value }) }} >{project && project.description}</Paragraph>
                        </PageHeader>

                    </Skeleton>
                </Col>
            </StyledRow>
            <StyledRow>
                <Col span={16}>
                    {project && <ProjectChart project={project} />}
                </Col>
                <Col span={8}>
                    <ProjectParamsCard />
                </Col>
            </StyledRow>
        </ProjectContext.Provider>
    )
}
