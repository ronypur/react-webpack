import * as React from "react";
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

interface SearchProps {
    value: string;
    onChange: any;
    children: any;
}

interface TableProps {
    list: Array<any>;
    pattern: string;
    onDismiss: any;
}

interface ButtonProps {
    onClick: any;
    className: string;
    children: any;
}

function isSearched(searchTerm: string): any {
    return (item: any) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

export class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    private onDismiss(id: number) {
        const updatedList = this.state.list.filter((item:any) => item.objectID !== id);
        this.setState({ list: updatedList });
    }

    private onSearchChange(event: any) {
        this.setState({ searchTerm: event.target.value})
    }

    private setSearchTopStories(result: any) {
        this.setState({result});
    }

    private fetchSearchTopStories(searchTerm: string) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result));
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
    }

    public render() {
        const { searchTerm, result } = this.state;

        if (!result) { return null; }

        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                    >
                        Search
                    </Search>
                </div>
                <Table
                    list={result.hits}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
            </div>
        );
    }
}

function Search(props: SearchProps) {
    return (
        <form>
            {props.children} <input
            type="text"
            value={props.value}
            onChange={props.onChange}
        />
        </form>
    );
}

function Table(props: TableProps) {
    return (
        <div className="table">
            {props.list.filter(isSearched(props.pattern)).map((item:any) =>
                <div key={item.objectID} className="table-row">
                    <span style={{width: '40%'}}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={{width: '30%'}}>
                        {item.author}
                    </span>
                    <span style={{width: '10%'}}>
                        {item.num_comments}
                    </span>
                    <span style={{width: '10%'}}>
                        {item.points}
                    </span>
                    <span style={{width: '10%'}}>
                        <Button
                            onClick={() => props.onDismiss(item.objectID)}
                            className="button-inline"
                        >
                            Dismiss
                        </Button>
                    </span>
                </div>
            )}
        </div>
    );
}

function Button(props: ButtonProps) {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={props.className}
        >
            {props.children}
        </button>
    );
}