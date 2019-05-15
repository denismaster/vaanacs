import React, { FC } from 'react';
import { Card } from 'antd';
import { ProjectSettingsTab } from './ProjectSettingsTab';
import { ProjectCriteriaTab } from './ProjectCriteriaTab';

const tabListNoTitle = [
        {
            key: 'settings',
            tab: 'Параметры',
        }, 
        {
            key: 'criterias',
            tab: 'Критерии',
        }
];

const contentListNoTitle: { [key:string]: any } = {
    "settings": <ProjectSettingsTab/>,
    "criterias": <ProjectCriteriaTab/>,
};

export class ProjectParamsCard extends React.Component {
    state = {
        key: 'settings',
        noTitleKey: 'settings',
    }

    onTabChange = (key:string, type:any) => {
        console.log(key, type);
        this.setState({ [type]: key });
    }

    render() {
        return (
            <Card
                style={{ width: '100%' }}
                tabList={tabListNoTitle}
                activeTabKey={this.state.noTitleKey}
                onTabChange={(key:string) => { this.onTabChange(key, 'noTitleKey'); }}
            >
                {contentListNoTitle[this.state.noTitleKey]}
            </Card>
        );
    }
}