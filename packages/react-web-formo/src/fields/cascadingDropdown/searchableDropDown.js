import React, { Component } from 'react';

import './styles.css';

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      item: '',
      focus: false,
    };
  }

  componentDidMount() {
    this.setState({
      listItems: this.props.items,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedValue !== this.props.selectedValue) {
      this.setState({ item: this.props.selectedValue });
    }
  }

  renderList = () => {
    return (
      <div
        className="list-wrapper"
        style={{
          border:
            this.state.listItems.length > 0
              ? '1px solid rgb(151, 151, 151)'
              : 'unset',
        }}
      >
        {this.state.listItems.map((item, index) => {
          return (
            <div
              onClick={() => {
                this.setState({ focus: false });
                this.props.onItemSelect(item.label);
              }}
              className="list-item"
              style={{
                borderBottom:
                  index === this.state.listItems.length - 1
                    ? 'unset'
                    : '1px solid #979797',
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };

  searchedItems = event => {
    const searchedText = event.target.value;
    const setSort = (item, searchedText) => {
      return item.label.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    };
    const ac = this.props.items.filter(item => {
      return setSort(item, searchedText);
    });
    this.setState({
      listItems: ac,
      item: searchedText,
    });
  };

  renderInput = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <div style={{ display: 'flex', height: 45 }}>
        <input
          type={'text'}
          value={this.state.item}
          id={attributes['name']}
          disabled={disableCondition}
          style={{
            opacity: disableCondition ? 0.5 : 1,
          }}
          className="cascading-input"
          onFocus={() =>
            this.setState({
              focus: true,
              listItems: this.props.items,
            })
          }
          placeholder={'-Select-'}
          onChange={this.searchedItems}
          // onBlur={() =>
          //   this.setState({ focus: false, item: this.props.selectedValue })
          // }
        />
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderInput()}
        {this.state.focus && this.renderList()}
      </div>
    );
  }
}
