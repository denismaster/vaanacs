import React from 'react';
import { Route, Switch } from "react-router";
import { Home } from "../pages/home/Home";
import { Projects } from "../pages/projects/Projects";
import { Layout } from 'antd';
import { Header } from './Header';
import { ProjectView } from '../pages/projects/ProjectView';

export function AppLayout() {
    return (
        <Layout className="layout">
            <Layout.Header style={{ backgroundColor: 'white' }}>
                <Header />
            </Layout.Header>
            <Layout.Content style={{margin:"1rem"}}>
                <Route path="/" exact component={Home} />
                <Switch>
                    <Route path="/projects" exact component={Projects}/>    
                    <Route path="/projects/:id" component={ProjectView} />
                </Switch>           
            </Layout.Content>
        </Layout>
    )
}