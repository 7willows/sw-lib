import { Component } from 'preact';
import style from './sw-select.style.css';
import _ from 'lodash';

let counter = 2;

export default class SwSelect extends Component {
    constructor() {
        super();
        this.toggleDropdownEventListener = this.toggleDropdownEventListener.bind(this);
        this.throttleSearch = _.throttle(async (sourceFn, value) => {
            try {
                const options = await sourceFn(value);

                this.setState({
                    error: options?.message ? 'Getting data has failed.' : null,
                    options: options?.documents ? options.documents : options,
                });
            } catch (err) {
                const error = 'Getting data has failed.';
                console.error(err, error);
                this.setState({ error });
            }
        }, 300, {
            wait: 0,
            leading: false,
        });
    }

    componentWillMount() {
        document.addEventListener('click', this.toggleDropdownEventListener);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.toggleDropdownEventListener);
    }

    toggleDropdownEventListener(e) {
        const classList = e.path[0].classList;
        const dropdown = this.ref.getRootNode().host.shadowRoot.querySelector('.show');

        if (dropdown
            && !classList.contains('button')
            && !classList.contains('dropdown')
            && !classList.contains('input')
            && !classList.contains('results')
            && !classList.contains('option')) {
            this.toggleDropdown();
        }
    }

    toggleDropdown() {
        this.setState({ isDropdownVisible: !this.state.isDropdownVisible });
        setTimeout(() => this.ref.getRootNode().host.shadowRoot.querySelector('input').focus(), 70);
        const dropdown = this.ref.getRootNode().host.shadowRoot.querySelector('.dropdown');
        dropdown.style.zIndex = this.state.isDropdownVisible ? counter-- : counter++;
    }

    sourceFnDefault(options) {
        return searchPhrase => options.filter(option => option.includes(searchPhrase));
    }

    setDisplayDropdownPosition() {
        const rect = this.ref.getRootNode().host.shadowRoot.querySelector('.button').getBoundingClientRect();
        this.setState({ shouldDisplayAbove: rect.bottom + 265 > window.innerHeight });
    }

    // todo: implement keys functionality
    keyAction(event) {
        switch (event.code) {
            case 'Escape':
                this.toggleDropdown();
                break;
            case 'ArrowDown':
                break;
            case 'ArrowUp':
                break;
            case 'Enter':
                break;
        }
    }

    onSearchChange(sourceFn, minimumCharLengthTrigger, event, initialOptions) {
        const value = event.target.value;
        minimumCharLengthTrigger = minimumCharLengthTrigger ?? 0;

        if (value.length <= minimumCharLengthTrigger) {
            this.setState({ options: initialOptions });
            return;
        }

        this.throttleSearch(sourceFn, value);
    }

    onOptionClick(option) {
        this.toggleDropdown();
        this.setState({ selectedOption: option.name ?? option });
        this.ref.getRootNode().host.dispatchEvent(new CustomEvent('change', {
            detail: option,
            bubbles: true
        }));
    }

    renderLabel(option, labelField) {
        if (typeof labelField !== 'string') {
            return option;
        }
        return option[labelField];
    }

    render({ config: { name, sourceFn, labelField, initialOptions, selected, minimumCharLengthTrigger } = {} }) {
        const options = this.state.options ? this.state.options : initialOptions;
        if (!name || !options || (sourceFn && !labelField)) {
            throw new Error('Missing "name" or "initialOptions" or "labelField" parameter.');
        }
        if (!sourceFn) sourceFn = this.sourceFnDefault(options);

        return <>
            <style>{style}</style>

            <div className="select-wrapper" ref={node => this.ref = node}>
                <label htmlFor={name}>{name}</label>
                <button className="button"
                    onClick={() => {
                        this.toggleDropdown();
                        this.setDisplayDropdownPosition();
                    }}>{this.state.selectedOption || selected || 'Please select an option ▼'}</button>

                <div className={`dropdown
                    ${this.state.isDropdownVisible && 'show'} 
                    ${this.state.shouldDisplayAbove && 'show-above'}`}>
                    <input className="input"
                        type="text"
                        placeholder="Start typing..."
                        id={name}
                        onKeyUp={event => this.keyAction(event)}
                        onInput={event => this.onSearchChange(sourceFn,
                            minimumCharLengthTrigger,
                            event,
                            initialOptions)} />

                    <div className="results">
                        {options[0] && (options ?? []).map(option => {
                            return <span className="option"
                                onClick={() => this.onOptionClick(option)}>
                                {this.renderLabel(option, labelField)}</span>;
                        })}
                    </div>

                    {this.state.error && <p className="error">{this.state.error}</p>}
                </div>
            </div>
        </>;
    }
}