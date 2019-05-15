import React, { Component, FC, useContext, useState } from 'react';
import { Form, Input, Empty, Select } from 'antd';
import { ProjectContext } from '../ProjectView';

export const ProjectSettingsTab: FC = () => {
    const { project, updateProject } = useContext(ProjectContext);

    const [maeValue, setMAEValue] = useState(0);
    const [convValue, setConvValue] = useState<"additive" | "multiplicative" | "chebyshev">("additive");

    if (!project) {
        return <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Недоступно"
        />
    }
    else {
        if (maeValue !== project.minAcceptableEfficiency) {
            setMAEValue(project.minAcceptableEfficiency);
        }
    }

    const updateMAE = (value: number) => {
        setMAEValue(value);
        updateProject({ minAcceptableEfficiency: value })
    }

    const updateConvolution = (value: number) => {
        setMAEValue(value);
        updateProject({ minAcceptableEfficiency: value })
    }

    return (
        <div>
            <Select defaultValue="additive" style={{ width: "100%" }} onChange={setConvValue}>
                <Select.Option value="additive">Аддитивная</Select.Option>
                <Select.Option value="multiplicative">Мультипликативная</Select.Option>
                <Select.Option value="chebyshev" disabled>Чебшева</Select.Option>
            </Select>
            <Input
                value={maeValue}
                placeholder="Минимальная допустимая эффективность"
                onChange={event => updateMAE(+event.target.value)}
            ></Input>
        </div>

    )
}