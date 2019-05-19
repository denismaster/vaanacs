import React, { useState, useContext } from 'react';
import { ProjectContext } from '../ProjectView';
import { Input, Row, Col, Slider, InputNumber, Collapse, Button, Form } from 'antd';
import { Criteria } from '../models/ProjectViewModel';

export function CriteriaForm(props: { criteria: Criteria }) {
    const { criteria } = props;
    let { weight, name } = criteria;
    
    weight = weight || 0;

    let [inputValue, setInputValue] = useState(weight);
    let [inputName, setInputName] = useState(name);

    const setValue = (value: any) => {
        if (Number.isNaN(value)) {
            return;
        }
        setInputValue(value);
    }

    return (
        <Form layout="vertical">
            <Form.Item label="Название">
                <Input placeholder="Name" value={inputName} onChange={e => setInputName(e.target.value)} />
            </Form.Item>
            <Form.Item label="Вес критерия">
                <Row>
                    <Col span={12}>
                        <Slider
                            min={0}
                            max={1}
                            onChange={setValue}
                            value={typeof inputValue === 'number' ? inputValue : 0}
                            step={0.01}
                        />
                    </Col>
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={1}
                            style={{ marginLeft: 16 }}
                            step={0.01}
                            value={inputValue}
                            onChange={setValue}
                        />
                    </Col>
                </Row>
            </Form.Item>

            {criteria.parts && criteria.parts.length &&
                <Collapse>
                    {
                        criteria.parts.map((ef, i) =>
                            <Collapse.Panel header={ef.type} key={i.toString()}></Collapse.Panel>
                        )
                    }
                </Collapse>
            }
        </Form>
    );
}