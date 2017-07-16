import * as fetch from "isomorphic-fetch";
import * as React from "react";

import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = "10"; // Hits Per Page
const PATH_BASE = "http://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

interface SearchProps {
    value?: string;
    onChange?: any;
    onSubmit?: any;
    children?: string;
}

interface TableProps {
    list: any[];
    onDismiss: any;
}

interface ButtonProps {
    onClick?: any;
    className?: string;
    children?: string;
}

export class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            results: null,
            searchKey: "",
            searchTerm: DEFAULT_QUERY,
        };

        this.needSearchTopStories = this.needSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    public componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
    }

    public render() {
        const { searchTerm, results, searchKey } = this.state;
        const page = (
                results &&
                results[searchKey] &&
                results[searchKey].page
            ) || 0;
        const list = (
                results &&
                results[searchKey] &&
                results[searchKey].hits
            ) || [];

        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                <Table
                    list={list}
                    onDismiss={this.onDismiss}
                />
                <div className="interactions">
                    <Button
                        onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
                    >
                        More
                    </Button>
                </div>
            </div>
        );
    }

    private needSearchTopStories(searchTerm: string) {
        return !this.state.results[searchTerm];
    }

    private onDismiss(id: number) {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];
        const isNotId = (item: any) => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        this.setState({
            results: {
                ...results, [searchKey]: { hits: updatedHits, page },
            },
        });
    }

    private onSearchChange(event: any) {
        this.setState({ searchTerm: event.target.value});
    }

    private onSearchSubmit(event: any) {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });

        if (this.needSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
        }

        event.preventDefault();
    }

    private setSearchTopStories(result: any) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

        const updateHits = [...oldHits, ...hits];

        this.setState({
            results: { ...results, [searchKey]: { hits: updateHits, page } },
        });
    }

    private fetchSearchTopStories(searchTerm: string, page: number) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then((response) => response.json())
            .then((result) => this.setSearchTopStories(result));
    }
}

export const Search = (props: SearchProps) => {
    return (
        <form onSubmit={props.onSubmit}>
            <input
                type="text"
                value={props.value}
                onChange={props.onChange}
            />
            <button type="submit">{props.children}</button>
        </form>
    );
};

export const Table = (props: TableProps) => {
    return (
        <div className="table">
            {props.list.map((item: any) =>
                <div key={item.objectID} className="table-row">
                    <span style={{width: "40%"}}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={{width: "30%"}}>
                        {item.author}
                    </span>
                    <span style={{width: "10%"}}>
                        {item.num_comments}
                    </span>
                    <span style={{width: "10%"}}>
                        {item.points}
                    </span>
                    <span style={{width: "10%"}}>
                        <Button
                            onClick={() => props.onDismiss(item.objectID)}
                            className="button-inline"
                        >
                            Dismiss
                        </Button>
                    </span>
                </div>,
            )}
        </div>
    );
};

export const Button = (props: ButtonProps) => {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={props.className}
        >
            {props.children}
        </button>
    );
};
