import React, { Component, FC, useContext, useState } from 'react';
import { Form, Input, Empty, Select, Divider, Row, Col, Typography } from 'antd';
import { ProjectContext } from '../ProjectView';
import { DatePicker } from 'antd';
import moment from 'moment';

const { Text } = Typography;

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export const ProjectSettingsTab: FC = () => {
    const { project, updateProject } = useContext(ProjectContext);

    const [maeValue, setMAEValue] = useState(0);
    const [convValue, setConvValue] = useState<"additive" | "multiplicative" | "chebyshev">("additive");

    const [step, setStep] = useState<"day" | "week" | "month" | "year">("month");

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

    let projectStartTime = moment(project.startTime);
    let projectFinishTime = project.endTime ? moment(project.endTime) : moment();

    let duration = projectFinishTime.diff(projectStartTime, step);

    return (
        <Form layout="vertical">
            <Row>
                <Col span={12}>
                    <Form.Item label="Временной интервал">
                        <RangePicker
                            placeholder={["Начальная дата", "Конечная дата"]}
                            value={[projectStartTime, projectFinishTime]}
                            format="YYYY-MM-DD HH:mm:ss" />

                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Шаг">
                        <Select defaultValue={step} onChange={setStep}>
                            <Select.Option value="day">День</Select.Option>
                            <Select.Option value="week">Неделя</Select.Option>
                            <Select.Option value="month">Месяц</Select.Option>
                            <Select.Option value="year">Год</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Text>{duration} {step}</Text>
                </Col>
            </Row>

            <Form.Item label="Метод свертки">
                <Select defaultValue="additive" style={{ width: "100%" }} onChange={setConvValue}>
                    <Select.Option value="additive">Аддитивная</Select.Option>
                    <Select.Option value="multiplicative">Мультипликативная</Select.Option>
                    <Select.Option value="chebyshev" disabled>Чебшева</Select.Option>
                </Select>
            </Form.Item>
            <Divider />
            <Form.Item label="Минимальная допустимая эффективность">
                <Input
                    value={maeValue}
                    placeholder=""
                    onChange={event => updateMAE(+event.target.value)}
                ></Input>
            </Form.Item>
        </Form>
    )
}