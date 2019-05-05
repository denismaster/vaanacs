import React, { useState, FC, useEffect, Component, Ref } from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { apiUrl } from '../../../constants';
import { ProjectViewModel } from '../models/ProjectViewModel';

const { TextArea } = Input;

interface AddProjectModalProps extends FormComponentProps {
    visible: boolean;
    onModalClose?: (createdProject: ProjectViewModel | null) => void;
    onCreate?: () => void;
    onCancel?: () => void;
}


function createProject(projectDef: { name: string, description?: string }): Promise<ProjectViewModel> {
    return fetch(`${apiUrl}/api/projects`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projectDef)
    })
        .then(results => results.json());
}

const AddProjectModalFC: FC<AddProjectModalProps> = ({ visible, onModalClose, form }) => {
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        onModalClose && onModalClose(null);
    }

    const handleCreate = () => {
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }

            setLoading(true);

            console.log('Received values of form: ', values);

            createProject({ name: values.name, description: values.description })
                .then(data => {
                    form.resetFields();
                    setLoading(false);
                    onModalClose && onModalClose(data);
                })
                .catch(err => notification.error({ message: "Не удалось создать проект" }));
        });
    }

    const { getFieldDecorator } = form;
    return (
        <Modal
            visible={visible}
            title="Новый проект"
            cancelText="Отмена"
            okText="Создать проект"
            confirmLoading={loading}
            onCancel={handleCancel}
            onOk={handleCreate}
        >
            <Form layout="vertical">
                <Form.Item label="Название">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Введите название проекта' }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="Описание">
                    {getFieldDecorator('description')(<TextArea />)}
                </Form.Item>
            </Form>
        </Modal>
    );
}

export const AddProjectModal = Form.create<AddProjectModalProps>({ name: 'add_project' })(AddProjectModalFC)