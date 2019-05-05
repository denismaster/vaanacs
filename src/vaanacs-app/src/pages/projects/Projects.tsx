import React, { useState, useEffect } from 'react';
import { Card, Button, PageHeader, Typography, Icon, notification } from 'antd';
import { ProjectsList } from './components/ProjectsList';
import { AddProjectModal } from './components/AddProjectModal';
import { ProjectViewModel } from './models/ProjectViewModel';
import { apiUrl } from '../../constants';
import { ProjectListModel } from './models/ProjectListModel';

const { Text } = Typography;

function loadProjectList(): Promise<ProjectListModel[]> {
    return fetch(`${apiUrl}/api/projects`)
        .then(results => results.json())
}

export function Projects() {
    const [modalVisible, setModalVisible] = useState(false);
    const [projects, setProjects] = useState<ProjectListModel[]>([])

    useEffect(() => {
        loadProjectList()
            .then(data => setProjects(data))
            .catch(e => notification.error({ message: "Не удалось загрузить данные" }));
    }, []);
    
    const handleModalClose = (project: ProjectViewModel | null )=> {
        if(project){
            loadProjectList()
                .then(data => setProjects(data))
                .catch(e => notification.error({ message: "Не удалось загрузить данные" }));
        }
        setModalVisible(false);
    }

    return (
        <div>
            <PageHeader
                title={<Text>Проекты</Text>}
                extra={[
                    <Button key="0" type="primary" onClick={()=>setModalVisible(true)}>
                        <Icon type="plus" /> Создать проект
                    </Button>
                ]}
            >
            </PageHeader>
            <Card>
                <ProjectsList projects={projects}/>
            </Card>
            <AddProjectModal onModalClose={handleModalClose} visible={modalVisible}/>
        </div>
    )
}

