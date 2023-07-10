/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/// <reference types="cypress" />

import {
    login,
    verifySortAsc,
    verifySortDesc,
    getTableColumnData,
    clickOnSortButton,
    deleteByList,
} from "../../../../../utils/utils";
import { name, tagCount, review, SortType } from "../../../../types/constants";
import * as data from "../../../../../utils/data_utils";
import { Assessment } from "../../../../models/migration/applicationinventory/assessment";

var applicationsList: Array<Assessment> = [];

describe(["@tier2"], "Application inventory sort validations", function () {
    before("Login and Create Test Data", function () {
        login();

        var tagsList = ["C++", "COBOL", "Java"];
        // Create multiple applications with tags
        for (let i = 0; i < 3; i++) {
            let appdata = {
                name: data.getFullName(),
                tags: tagsList,
            };
            // Create new application
            const application = new Assessment(appdata);
            application.create();
            applicationsList.push(application);
            tagsList.pop();
        }
    });

    beforeEach("Interceptors", function () {
        // Interceptors
        cy.intercept("GET", "/hub/application*").as("getApplications");
    });

    it("Name sort validations", function () {
        // Navigate to application inventory page
        Assessment.open();
        cy.wait("@getApplications");

        // get unsorted list when page loads
        const unsortedList = getTableColumnData(name);

        // Sort the application inventory by name in ascending order
        clickOnSortButton(name, SortType.ascending);
        cy.wait(2000);

        // Verify that the application inventory table rows are displayed in ascending order
        const afterAscSortList = getTableColumnData(name);
        verifySortAsc(afterAscSortList, unsortedList);

        // Sort the application inventory by name in descending order
        clickOnSortButton(name, SortType.descending);
        cy.wait(2000);

        // Verify that the application inventory table rows are displayed in descending order
        const afterDescSortList = getTableColumnData(name);
        verifySortDesc(afterDescSortList, unsortedList);
    });

    // Add Test case for sorting by business service

    it("Bug MTA-916: Tag count sort validations", function () {
        // Navigate to application inventory page
        Assessment.open();
        cy.wait("@getApplications");

        // get unsorted list when page loads
        const unsortedList = getTableColumnData(tagCount);

        // Sort the application inventory by Tag count in ascending order
        clickOnSortButton(tagCount, SortType.ascending);
        cy.wait(2000);

        // Verify that the application inventory table rows are displayed in ascending order
        const afterAscSortList = getTableColumnData(tagCount);
        verifySortAsc(afterAscSortList, unsortedList);

        // Sort the application inventory by tags in descending order
        clickOnSortButton(tagCount, SortType.descending);
        cy.wait(2000);

        // Verify that the application inventory table rows are displayed in descending order
        const afterDescSortList = getTableColumnData(tagCount);
        verifySortDesc(afterDescSortList, unsortedList);
    });

    after("Perform test data clean up", function () {
        // Delete the applications created before the tests
        deleteByList(applicationsList);
    });
});
