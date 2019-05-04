import React from 'react';
import { Card, Button, PageHeader, Typography, Icon } from 'antd';
import { ProjectsList } from './components/ProjectsList';

const { Text } = Typography;

export function Projects() {
    return (
        <div>
            <PageHeader
                title={<Text>Проекты</Text>}
                extra={[
                    <Button type="primary">
                        <Icon type="plus" /> Создать проект
                    </Button>
                ]}
            >
            </PageHeader>
            <Card>
                <ProjectsList />
            </Card>
        </div>
    )
}

