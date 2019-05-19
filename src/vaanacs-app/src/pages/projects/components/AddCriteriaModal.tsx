import React, { useState, FC, useEffect, Component, Ref } from 'react';
import { Modal, Form, Input, notification, Row, Col, Slider, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ProjectViewModel } from '../models/ProjectViewModel';

interface AddCriteriaModalProps extends FormComponentProps {
    visible: boolean;
    onCreate?: (data: { name: string, weight: number }) => void;
    onCancel?: () => void;
}

const AddCriteriaModalFC: FC<AddCriteriaModalProps> = ({ visible, onCreate, onCancel, form }) => {
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        onCancel && onCancel();
    }

    const handleCreate = () => {
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);

            form.resetFields();
            setLoading(false);
            onCreate && onCreate({ name: values.name, weight: +values.weight });
        });
    }

    const { getFieldDecorator } = form;
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
            </Form>
        </Modal>
    );
}

export const AddCriteriaModal = Form.create<AddCriteriaModalProps>({ name: 'add_criteria' })(AddCriteriaModalFC)