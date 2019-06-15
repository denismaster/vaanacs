import React, { useState, FC, ReactElement } from 'react';
import { Modal, Form, Input, Slider, Select, Upload, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ProjectViewModel } from '../models/ProjectViewModel';
import { CriteriaAddModel } from '../models/CriteriaAddModel';
import request from 'request-promise'
import { apiUrl } from '../../../constants';
import { UploadFile } from 'antd/lib/upload/interface';

import axios from 'axios';

async function createCriteria(project: ProjectViewModel, criteriaModel: CriteriaAddModel, fileList: UploadFile[]) {

    if (criteriaModel.type === "spline") {
        let formData = new FormData();

        formData.append('type', criteriaModel.type);
        formData.append('name', criteriaModel.name)
        formData.append('weight', criteriaModel.weight.toString());
        fileList.forEach(file => {
            formData.append('file', file as any);
        });

        return await axios.post(`${apiUrl}/api/projects/${project._id}/criterias`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    }

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

const AddCriteriaModalFC: FC<AddCriteriaModalProps> = ({ visible, project, onCancel, form }) => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

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

            let criteria = { type: criteriaType, ...values }

            await createCriteria(project, criteria, fileList);
            setLoading(false);
            onCancel && onCancel();
        });
    }

    const { getFieldDecorator } = form;

    const fileUploadProps = {
        onRemove: (file: UploadFile) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file: UploadFile) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    let getValueFromEvent = function (e: any): any {
        if (!e || !e.fileList) {
            return e;
        }

        const { fileList } = e;
        return fileList;
    }

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

        case "spline": formControls = <Form.Item label="Файл с данными">
            {getFieldDecorator('data', {
                valuePropName: 'fileList',
                getValueFromEvent
            })(
                <Upload {...fileUploadProps}>
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