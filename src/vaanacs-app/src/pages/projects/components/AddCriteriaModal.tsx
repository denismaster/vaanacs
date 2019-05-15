import React, { useState, FC, useEffect, Component, Ref } from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ProjectViewModel } from '../models/ProjectViewModel';

interface AddCriteriaModalProps extends FormComponentProps {
    visible: boolean;
    onCreate?: (data: { name: string }) => void;
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
            onCreate && onCreate({ name: values.name });
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
            </Form>
        </Modal>
    );
}

export const AddCriteriaModal = Form.create<AddCriteriaModalProps>({ name: 'add_criteria' })(AddCriteriaModalFC)