import React, { Component, FC, useContext, useState } from 'react';
import { Form, Input, Empty, Button, Collapse } from 'antd';
import { ProjectContext } from '../ProjectView';
import { AddCriteriaModal } from './AddCriteriaModal';
import { CriteriaForm } from './CriteriaForm';

export const ProjectCriteriaTab: FC = () => {
    const { project, updateProject } = useContext(ProjectContext);
    const [modalVisible, setModalVisible] = useState(false);

    if (!project) {
        return <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Недоступно"
        />
    }

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button onClick={() => setModalVisible(true)}>Добавить критери</Button>
            </div>
            <Collapse bordered={false}>
                {
                    project.criterias.map((c, i) =>
                        <Collapse.Panel header={c.name} key={i.toString()}>
                            <CriteriaForm criteria={c}></CriteriaForm>
                        </Collapse.Panel>
                    )
                }
            </Collapse>
            <AddCriteriaModal project={project} onCancel={() => setModalVisible(false)} visible={modalVisible} />
        </div>
    )
}