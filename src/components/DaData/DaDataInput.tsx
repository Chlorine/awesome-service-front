import * as React from 'react';
import Highlighter from 'react-highlight-words';

import { DaDataApi, DaDataSuggestion } from './dadata';
import { BoundsType, DaDataAddress } from './dadata-addr';
import { DaDataGender, DaDataNamePart } from './dadata-fio';

import './DaDataInput.css';

export type Props = {
  placeholder?: string;
  query: string;
  minCharsToStart?: number;
  autoLoad?: boolean;
  count?: number;
  onChange?: (suggestion: DaDataSuggestion<any>) => void;
  onInputChange?: (value: string) => void;
  onInputBlur?: (e: React.FocusEvent<any>) => void;
  onBtnClear?: () => void;
  namePart: DaDataNamePart;
  autocomplete?: string;
  // validate?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  fromBound?: BoundsType;
  toBound?: BoundsType;
  address?: DaDataSuggestion<DaDataAddress>;
  name?: string;
  gender?: DaDataGender;
  suggestionNote?: string;
};

declare type State = {
  query: string;
  inputQuery: string;
  inputFocused: boolean;
  suggestions: Array<DaDataSuggestion<any>>;
  suggestionIndex: number;
  suggestionsVisible: boolean;
};

class DaDataInput extends React.Component<Props, State> {
  state: State;
  inputRef = React.createRef<HTMLInputElement>();
  daDataApi = new DaDataApi();

  constructor(props: Props) {
    super(props);

    this.state = {
      query: this.props.query ? this.props.query : '',
      inputQuery: this.props.query ? this.props.query : '',
      inputFocused: false,
      suggestions: [],
      suggestionIndex: -1,
      suggestionsVisible: true,
    };
  }

  setSuggestions = (suggestions: DaDataSuggestion<any>[]) => {
    this.setState({
      suggestions: this.state.query ? suggestions : [],
      suggestionIndex: -1,
    });
  };

  componentDidMount() {
    this.daDataApi.subscribe(this.setSuggestions);

    if (this.props.autoLoad && this.state.query) {
      this.fetchSuggestions();
    }
  }

  componentWillUnmount(): void {
    this.daDataApi.onOwnerUnmount();
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ): void {
    const { query } = this.props;
    if (query !== prevProps.query) {
      this.setState({
        query,
        inputQuery: query,
        // suggestionsVisible: false,
      });
    }
  }

  onInputFocus = () => {
    this.setState({ inputFocused: true });
    if (this.state.suggestions.length === 0) {
      this.fetchSuggestions();
    }
  };

  onInputBlur = (e: React.FocusEvent<any>) => {
    this.setState({ inputFocused: false });
    if (this.state.suggestions.length === 0) {
      this.fetchSuggestions();
    }

    if (this.props.onInputBlur) {
      this.props.onInputBlur(e);
    }
  };

  onBtnClear = () => {
    this.setState({ query: '', inputQuery: '', suggestionsVisible: false });
    this.inputRef.current && this.inputRef.current.focus();
    if (this.props.onBtnClear) {
      this.props.onBtnClear();
    }
  };

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const { onInputChange } = this.props;

    this.setState(
      { query: value, inputQuery: value, suggestionsVisible: true },
      () => {
        // if (this.props.validate) {
        //   this.props.validate(value);
        // }

        this.fetchSuggestions();
      },
    );

    onInputChange && onInputChange(value);
  };

  onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.which === 40) {
      // Arrow down
      event.preventDefault();
      if (this.state.suggestionIndex < this.state.suggestions.length - 1) {
        const newSuggestionIndex = this.state.suggestionIndex + 1;
        const newInputQuery = this.state.suggestions[newSuggestionIndex].value;
        this.setState({
          suggestionIndex: newSuggestionIndex,
          query: newInputQuery,
        });
      }
    } else if (event.which === 38) {
      // Arrow up
      event.preventDefault();
      if (this.state.suggestionIndex >= 0) {
        const newSuggestionIndex = this.state.suggestionIndex - 1;
        const newInputQuery =
          newSuggestionIndex === -1
            ? this.state.inputQuery
            : this.state.suggestions[newSuggestionIndex].value;
        this.setState({
          suggestionIndex: newSuggestionIndex,
          query: newInputQuery,
        });
      }
    } else if (event.which === 13) {
      // Enter
      event.preventDefault();
      if (this.state.suggestionIndex >= 0) {
        this.selectSuggestion(this.state.suggestionIndex);
      }
    }
  };

  fetchSuggestions = () => {
    const { query } = this.state;

    const { minCharsToStart } = this.props;

    if (query.length >= (minCharsToStart || 2)) {
      this.daDataApi.beginFetchFio(
        query,
        this.props.namePart,
        this.props.gender || 'UNKNOWN',
      );
    } else {
      this.setSuggestions([]);
    }
  };

  onSuggestionClick = (
    index: number,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();
    this.selectSuggestion(index);
  };

  selectSuggestion = (index: number) => {
    if (this.state.suggestions.length >= index - 1) {
      this.setState(
        {
          query: this.state.suggestions[index].value,
          suggestionsVisible: false,
          inputQuery: this.state.suggestions[index].value,
        },
        () => {
          // this.fetchSuggestions();
          setTimeout(() => {
            this.inputRef.current && this.setCursorToEnd(this.inputRef.current);
          }, 100);
        },
      );

      if (this.props.onChange) {
        this.props.onChange(this.state.suggestions[index]);
      }
    }
  };

  setCursorToEnd = (element: HTMLInputElement) => {
    const valueLength = element.value.length;
    if (element.selectionStart) {
      // Firefox/Chrome
      element.selectionStart = valueLength;
      element.selectionEnd = valueLength;
      element.focus();
    }
  };

  getHighlightWords = (): Array<string> => {
    const wordsToPass = [
      'г',
      'респ',
      'ул',
      'р-н',
      'село',
      'деревня',
      'поселок',
      'пр-д',
      'пл',
      'к',
      'кв',
      'обл',
      'д',
    ];
    let words = this.state.inputQuery.replace(',', '').split(' ');
    words = words.filter(word => {
      return wordsToPass.indexOf(word) < 0;
    });
    return words;
  };

  render() {
    const classNames = ['react-dadata__input form-control'];

    const {
      query,
      inputFocused,
      suggestionIndex,
      suggestionsVisible,
      suggestions,
    } = this.state;
    const { placeholder, disabled } = this.props;

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className="react-dadata react-dadata__container">
        <div className="input-group">
          <input
            className={classNames.join(' ')}
            disabled={disabled}
            placeholder={placeholder || ''}
            value={query}
            name={this.props.name}
            ref={this.inputRef}
            onChange={this.onInputChange}
            onKeyPress={this.onKeyPress}
            onKeyDown={this.onKeyPress}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            // validate={this.props.validate}
            autoComplete={
              this.props.autocomplete ? this.props.autocomplete : 'off'
            }
          />
          {!!query && (
            <div className="input-group-append">
              <button
                className="btn btn-secondary pl-1 pr-1 btn-light border"
                type="button"
                id="button-addon2"
                disabled={disabled}
                onClick={this.onBtnClear}
                tabIndex={-1}
              >
                <span className="text-muted">
                  <i className="fa fa-times" />
                </span>
              </button>
            </div>
          )}
        </div>
        {inputFocused &&
          suggestionsVisible &&
          suggestions &&
          suggestions.length > 0 && (
            <div className="react-dadata__suggestions">
              <div className="react-dadata__suggestion-note">
                {this.props.suggestionNote ||
                  'Выберите вариант или продолжите ввод'}
              </div>
              {suggestions.map((suggestion, index) => {
                let suggestionClass = 'react-dadata__suggestion';
                if (index === suggestionIndex) {
                  suggestionClass += ' react-dadata__suggestion--current';
                }
                return (
                  <div
                    key={suggestion.value}
                    onMouseDown={ev => this.onSuggestionClick(index, ev)}
                    className={suggestionClass}
                  >
                    <Highlighter
                      highlightClassName="react-dadata--highlighted"
                      autoEscape={true}
                      searchWords={this.getHighlightWords()}
                      textToHighlight={suggestion.value}
                    />
                  </div>
                );
              })}
            </div>
          )}
      </div>
    );
  }
}

export default DaDataInput;
