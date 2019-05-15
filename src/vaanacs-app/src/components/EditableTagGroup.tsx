import { Tag, Tooltip, Input, Icon } from "antd";
import React, { Component } from "react";

interface EditableTabGroupProps {
    tags?: string[],
    onChange?: (tags: string[]) => void;
}

export class EditableTagGroup extends Component<EditableTabGroupProps, {
    tags: string[],
    inputVisible: boolean,
    inputValue: string
}> {
    constructor(props: any) {
        super(props);

        const { tags, onChange } = props;

        if (onChange) {
            this.onChange = onChange;
        }

        this.state = {
            tags: tags || [],
            inputVisible: false,
            inputValue: ' ',
        };
    }

    onChange: (tags: string[]) => void = (_) => { };

    handleClose = (removedTag: any) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags }, () => this.onChange(this.state.tags));
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e: any) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        }, () => this.onChange(this.state.tags));

    }

    saveInputRef = (input: any) => this.input = input
    input: any;

    render() {
        const { tags, inputVisible, inputValue } = this.state;
        return (
            <span>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                        <Icon type="plus" /> Добавить метку
            </Tag>
                )}
            </span>
        );
    }
}
