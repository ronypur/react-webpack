import * as fetch from "isomorphic-fetch";
import { sortBy } from "lodash";
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

const SORTS: any = {
    AUTHOR: (list: any) => sortBy(list, "author"),
    COMMENTS: (list: any) => sortBy(list, "num_comments").reverse(),
    NONE: (list: any) => list,
    POINTS: (list: any) => sortBy(list, "points").reverse(),
    TITLE: (list: any) => sortBy(list, "title"),
};

interface ButtonProps {
    onClick?: any;
    className?: string;
    children?: string;
}

interface SearchProps {
    value?: string;
    onChange?: any;
    onSubmit?: any;
    children?: string;
}

interface SortProps {
    sortKey?: string;
    onSort?: any;
    activeSortKey?: string;
    children?: string;
}

interface TableProps {
    isSortReverse?: boolean;
    list: any[];
    onDismiss?: any;
    onSort?: any;
    sortKey?: string;
}

interface WithLoadingProps {
    isLoading?: boolean;
}

export class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            isSortReverse: false,
            results: null,
            searchKey: "",
            searchTerm: DEFAULT_QUERY,
            sortKey: "NONE",
        };

        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needSearchTopStories = this.needSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onSort = this.onSort.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
    }

    public componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
    }

    public render() {
        const {
            isLoading,
            isSortReverse,
            results,
            searchKey,
            searchTerm,
            sortKey,
        } = this.state;
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
                    isSortReverse={isSortReverse}
                    list={list}
                    onDismiss={this.onDismiss}
                    onSort={this.onSort}
                    sortKey={sortKey}
                />
                <div className="interactions">
                    <ButtonWithLoading
                        isLoading={isLoading}
                        onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
                    >
                        More
                    </ButtonWithLoading>
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

    private onSort(sortKey: string) {
        const isSortReverse: boolean = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse });
    }

    private setSearchTopStories(result: any) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

        const updateHits = [...oldHits, ...hits];

        this.setState({
            isLoading: false,
            results: { ...results, [searchKey]: { hits: updateHits, page } },
        });
    }

    private fetchSearchTopStories(searchTerm: string, page: number) {
        this.setState({ isLoading: true });

        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then((response) => response.json())
            .then((result) => this.setSearchTopStories(result));
    }
}

export const withLoading = (Component: any) => {
    return ({ isLoading, ...rest }: WithLoadingProps): any => {
        return isLoading ? <Loading /> : <Component { ...rest }/>;
    };
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

export const ButtonWithLoading = withLoading(Button);

export const Loading = () => {
    return (<div>Loading...</div>);
};

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

export const Sort = (props: SortProps) => {
    const sortClass = ["button-inline"];

    if (props.sortKey === props.activeSortKey) {
        sortClass.push("button-active");
    }

    return(
        <Button
            onClick={() => props.onSort(props.sortKey)}
            className={sortClass.join(" ")}
        >
            {props.children}
        </Button>
    );
};

export const Table = (props: TableProps) => {
    const sortedList: any = SORTS[props.sortKey](props.list);
    const reverseSortedList = props.isSortReverse
        ? sortedList.reverse()
        : sortedList;
    return (
        <div className="table">
            <div className="table-header">
                <span style={{ width: "40%" }}>
                    <Sort
                        activeSortKey={props.sortKey}
                        onSort={props.onSort}
                        sortKey={"TITLE"}
                    >
                        Title
                    </Sort>
                </span>
                <span style={{ width: "30%" }}>
                    <Sort
                        activeSortKey={props.sortKey}
                        onSort={props.onSort}
                        sortKey={"AUTHOR"}
                    >
                        Author
                    </Sort>
                </span>
                <span style={{ width: "10%" }}>
                    <Sort
                        activeSortKey={props.sortKey}
                        onSort={props.onSort}
                        sortKey={"COMMENTS"}
                    >
                        Comments
                    </Sort>
                </span>
                <span style={{ width: "10%" }}>
                    <Sort
                        activeSortKey={props.sortKey}
                        onSort={props.onSort}
                        sortKey={"POINTS"}
                    >
                        Points
                    </Sort>
                </span>
                <span style={{ width: "10%" }}>
                    Archive
                </span>
            </div>
            {reverseSortedList.map((item: any) =>
                <div key={item.objectID} className="table-row">
                    <span style={{ width: "40%" }}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={{ width: "30%" }}>
                        {item.author}
                    </span>
                    <span style={{ width: "10%" }}>
                        {item.num_comments}
                    </span>
                    <span style={{ width: "10%" }}>
                        {item.points}
                    </span>
                    <span style={{ width: "10%" }}>
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
