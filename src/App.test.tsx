import { shallow } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as renderer from "react-test-renderer";

import { App, Button, Search, Table } from "./App";

describe("App", () => {
    it("renders", () => {
        const div = document.createElement("div");
        ReactDOM.render(<App />, div);
    });

    test("snapshots", () => {
        const component = renderer.create(<App />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Button", () => {
    it("renders", () => {
        const div = document.createElement("div");
        ReactDOM.render(<Button>Give Me More</Button>, div);
    });

    test("snapshots", () => {
        const component = renderer.create(
            <Button>Give Me More</Button>,
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Search", () => {
    it("renders", () => {
        const div = document.createElement("div");
        ReactDOM.render(<Search>Go</Search>, div);
    });

    test("snapshots", () => {
        const component = renderer.create(
            <Search>Go</Search>,
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Table", () => {
    const props = {
        list: [
            { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
            { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" },
        ],
    };

    it("renders", () => {
        const div = document.createElement("div");
        ReactDOM.render(<Table { ...props } />, div);
    });

    test("snapshots", () => {
       const component = renderer.create(
           <Table { ...props } />,
       );
       const tree = component.toJSON();
       expect(tree).toMatchSnapshot();
    });

    it("shows two item in list", () => {
        const component = shallow(<Table { ...props } />);
        expect(component.find(".table-row").length).toBe(2);
    });
});
