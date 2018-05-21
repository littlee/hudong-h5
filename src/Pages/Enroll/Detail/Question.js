import React from 'react';
import styled from 'styled-components';
import ALPH from './ALPH';
import FilePicker from './FilePicker';

import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';

const QuestionWrap = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const QuestionTitle = styled.h4`
  margin: 0;
  margin-bottom: 10px;

  &:before {
    content: "${props => (props.required ? '*' : '')}";
    color: red;
    margin-right: 5px;
  }
`;

const QuestionDesc = styled.p`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const QuestionImg = styled.img`
  max-width: 100%;
  display: block;
  margin-bottom: 10px;
`;

const QuestionOption = styled.div`
  background-color: ${props => (props.active ? '#81D4FA' : '#eee')};
  padding: 3px;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const QuestionOptionImg = styled.img`
  display: block;
  max-width: 100%;
  margin: 5px;
`;

const OptionAlph = styled.div`
  display: inline-block;
  width: 2em;
  height: 2em;
  border: 1px solid #ddd;
  text-align: center;
  line-height: 2em;
  border-radius: 50%;
  margin-right: 5px;
  background-color: white;
`;

const QuestionInput = styled.input`
  display: block;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  padding: 5px;
  outline: 0;
`;

const QuestionTip = styled.div`
  color: #333;
  padding: 5px;
`;

const QuestionTextArea = QuestionInput.withComponent('textarea');

const QuestionFiles = styled.div`
  padding-top: 5%;
  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:after {
    clear: both;
  }
`;

const Question = props => {
  if (props.type === 'single_choose') {
    return (
      <QuestionWrap>
        <QuestionTitle required={props.required}>
          {`${props.index + 1}. ${props.title} (单选)`}
        </QuestionTitle>
        {props.description ? (
          <QuestionDesc>{props.description}</QuestionDesc>
        ) : null}
        {props.imageurl ? <QuestionImg src={props.imageurl} /> : null}

        {props.options.map((op, index) => (
          <QuestionOption
            key={index}
            active={props.answers[0] === index}
            onClick={() => {
              props.changeAnswer(props.index, [index]);
            }}
          >
            <OptionAlph>{ALPH[index]}</OptionAlph>
            {op.name}
            {op.imageurl ? <QuestionOptionImg src={op.imageurl} /> : null}
          </QuestionOption>
        ))}
      </QuestionWrap>
    );
  }

  if (props.type === 'multi_choose') {
    return (
      <QuestionWrap>
        <QuestionTitle required={props.required}>
          {`${props.index + 1}. ${props.title} (多选)`}
        </QuestionTitle>
        {props.description ? (
          <QuestionDesc>{props.description}</QuestionDesc>
        ) : null}
        {props.imageurl ? <QuestionImg src={props.imageurl} /> : null}

        {props.options.map((op, index) => (
          <QuestionOption
            key={index}
            active={props.answers.indexOf(index) !== -1}
            onClick={() => {
              const isActive = props.answers.indexOf(index) !== -1;

              if (isActive) {
                const nAns = props.answers.filter(item => {
                  return item !== index;
                });
                props.changeAnswer(props.index, nAns);
              } else {
                const nAns = props.answers.concat(index);
                props.changeAnswer(props.index, nAns);
              }
            }}
          >
            <OptionAlph>{ALPH[index]}</OptionAlph>
            {op.name}
            {op.imageurl ? <QuestionOptionImg src={op.imageurl} /> : null}
          </QuestionOption>
        ))}
      </QuestionWrap>
    );
  }

  if (props.type === 'extra_file') {
    return (
      <QuestionWrap>
        <QuestionTitle required={props.required}>
          {`${props.index + 1}. ${props.title} (上传附件)`}
        </QuestionTitle>
        {props.description ? (
          <QuestionDesc>{props.description}</QuestionDesc>
        ) : null}
        {props.imageurl ? <QuestionImg src={props.imageurl} /> : null}

        <QuestionFiles>
          {props.answers.map((ans, index) => (
            <FilePicker
              key={index}
              answer={ans}
              onChangeName={name => {
                let nAns = props.answers.slice();
                nAns[index].name = name;
                props.changeAnswer(props.index, nAns);
              }}
              onComplete={value => {
                let nAns = props.answers.slice();
                nAns[index].value = value;
                props.changeAnswer(props.index, nAns);
              }}
              onClear={() => {
                let nAns = props.answers.slice();
                nAns[index].value = '';
                props.changeAnswer(props.index, nAns);
              }}
            />
          ))}
        </QuestionFiles>
        <QuestionTip>提示：至少上传 {props.min_num} 个附件</QuestionTip>
      </QuestionWrap>
    );
  }

  if (props.type === 'sort') {
    const SortItem = SortableElement(props => (
      <QuestionOption>
        <OptionAlph>{ALPH[props.opIndex]}</OptionAlph>
        {props.name}
        {props.imageurl ? <QuestionOptionImg src={props.imageurl} /> : null}
      </QuestionOption>
    ));

    const SortItems = SortableContainer(props => (
      <div>
        {props.answers.map((ans, index) => {
          const option = props.options[ans];
          return (
            <SortItem {...option} index={index} opIndex={ans} key={index} />
          );
        })}
      </div>
    ));

    return (
      <QuestionWrap>
        <QuestionTitle required={props.required}>
          {`${props.index + 1}. ${props.title} (排序)`}
        </QuestionTitle>
        {props.description ? (
          <QuestionDesc>{props.description}</QuestionDesc>
        ) : null}
        {props.imageurl ? <QuestionImg src={props.imageurl} /> : null}

        <SortItems
          answers={props.answers}
          options={props.options}
          onSortEnd={({ oldIndex, newIndex }) => {
            let nAns = props.answers.slice();
            nAns = arrayMove(nAns, oldIndex, newIndex);
            props.changeAnswer(props.index, nAns);
          }}
        />

        <QuestionTip>提示：拖动选项进行排序</QuestionTip>
      </QuestionWrap>
    );
  }

  if (props.type === 'input') {
    return (
      <QuestionWrap>
        <QuestionTitle required={props.required}>
          {props.index + 1}. {props.title}
        </QuestionTitle>
        {props.description ? (
          <QuestionDesc>{props.description}</QuestionDesc>
        ) : null}
        {props.imageurl ? <QuestionImg src={props.imageurl} /> : null}

        {props.lines <= 1 ? (
          <QuestionInput
            maxLength={props.max_num}
            value={props.answers[0] || ''}
            onChange={e => {
              props.changeAnswer(props.index, [e.target.value]);
            }}
          />
        ) : (
          <QuestionTextArea
            rows={props.lines}
            maxLength={props.max_num}
            value={props.answers[0] || ''}
            onChange={e => {
              props.changeAnswer(props.index, [e.target.value]);
            }}
          />
        )}
      </QuestionWrap>
    );
  }

  return <div>{props.type}</div>;
};

export default Question;
