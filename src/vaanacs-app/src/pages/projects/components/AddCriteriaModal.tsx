import React, { useState, FC, useEffect, Component, Ref, ChangeEvent, ReactElement } from 'react';
import { Modal, Form, Input, notification, Row, Col, Slider, InputNumber, Select, Upload, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ProjectViewModel } from '../models/ProjectViewModel';
import { CriteriaAddModel } from '../models/CriteriaAddModel';
import request from 'request-promise'
import { apiUrl } from '../../../constants';

async function createCriteria(project: ProjectViewModel,criteriaModel:CriteriaAddModel) {
    return await request({
        method: 'POST',
        uri: `${apiUrl}/api/projects/${project._id}/criterias`,
        body: criteriaModel,
        json: true
    })
}


export type CriteriaType = "constant"
    | "linear"
    | "exponent"
    | "quadratic"
    | "spline"

interface AddCriteriaModalProps extends FormComponentProps {
    visible: boolean;
    project: ProjectViewModel,
    onCancel?: () => void;
}

const AddCriteriaModalFC: FC<AddCriteriaModalProps> = ({ visible,project, onCancel, form }) => {
    const [loading, setLoading] = useState(false);

    const [criteriaType, setCriteriaType] = useState<CriteriaType>("constant");

    const handleCancel = () => {
        onCancel && onCancel();
    }

    const handleCreate = () => {
        form.validateFields(async (err: any, values: any) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);

            form.resetFields();
            setLoading(true);

            let criteria = { type: criteriaType, ...values}

            await createCriteria(project,criteria);
            setLoading(false);
            onCancel && onCancel();
        });
    }

    const { getFieldDecorator } = form;

    let formControls: ReactElement | null = null;

    switch (criteriaType) {
        case "constant":
            formControls = <Form.Item label="Значение">
                {getFieldDecorator('value', {
                    rules: [{ required: true, message: 'Введите значения параметра' }],
                })(
                    <Input />
                )}
            </Form.Item>;
            break;

        case "linear":
        case "quadratic":
        case "exponent": formControls = <div>
            <Form.Item label="Коэфициент K">
                {getFieldDecorator('k', {
                    rules: [{ required: true, message: 'Введите значения параметра' }],
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item label="Коэфициент B">
                {getFieldDecorator('b', {
                    rules: [{ required: true, message: 'Введите значения параметра' }],
                })(
                    <Input />
                )}
            </Form.Item>
        </div>;
            break;

        case "spline": formControls = <Form.Item label="Файл с данными" extra="data.csv">
            {getFieldDecorator('data', {
                valuePropName: 'fileList',
            })(
                <Upload name="data" beforeUpload={()=>false}>
                    <Button>
                        <Icon type="upload" /> Загрузить...
                    </Button>
                </Upload>,
            )}
        </Form.Item>;
            break;
    }

    return (
        <Modal
            visible={visible}
            title="Новый критерий"
            cancelText="Отмена"
            okText="Добавить критерий"
            confirmLoading={loading}
            onCancel={handleCancel}
            onOk={handleCreate}
        >
            <Form layout="vertical">
                <Form.Item label="Название">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Введите название критерия' }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="Вес критерия">
                    {getFieldDecorator('weight', {
                        rules: [{ required: true, message: 'Введите вес критерия' }],
                    })(
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                        />
                    )}
                </Form.Item>
                <Form.Item label="Тип">
                    {getFieldDecorator('type', {
                        rules: [{ required: true, message: 'Введите тип критерия' }],
                    })(
                        <Select
                            defaultValue="constant"
                            value={criteriaType}
                            onChange={(e: any) => setCriteriaType(e)}
                        >
                            <Select.Option value="constant">Константный</Select.Option>
                            <Select.Option value="linear">Линейный</Select.Option>
                            <Select.Option value="exponent">Экспоненциальный</Select.Option>
                            <Select.Option value="quadratic">Квадратичный</Select.Option>
                            <Select.Option value="spline">Набор данных</Select.Option>
                            {/* <Select.Option value="spline">Сплайн</Select.Option>
                            <Select.Option value="webhook">Webhook</Select.Option> */}
                        </Select>
                    )}
                </Form.Item>
                {formControls}
                <Form.Item label="Нормализация">
                    {getFieldDecorator('normalization', {
                        rules: [{ required: true, message: 'Введите тип критерия' }],
                    })(
                        <Select
                            defaultValue="none"
                        >
                            <Select.Option value="none">Не требуется</Select.Option>
                            <Select.Option value="prop_geg_val">Значение выше указанного(вероятн.)</Select.Option>
                            <Select.Option value="prop_leg_val">Значение ниже указанного(вероятн.)</Select.Option>
                        </Select>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
}

export const AddCriteriaModal = Form.create<AddCriteriaModalProps>({ name: 'add_criteria' })(AddCriteriaModalFC)